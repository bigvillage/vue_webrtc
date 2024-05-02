<script setup>
import { io } from "socket.io-client";
import { onMounted, ref } from "vue";
import RecordRTC from "recordrtc";

const socket = io.connect("wss://local.saerom.co.kr", {
  path: "/socket.io",
  secure: true,
});

const roomName = ref("seahwang");
const isMaster = ref(false);
const myPeerConnection = ref(null);
const usersArr = ref([]);
const localVideoRef = ref(null);
const myStream = ref(null);
const receiveUsers = ref({});
const isRecording = ref(false);
const ing = ref(false);
const waitingText = ref(false);
const doneRecording = ref(false);
const devices = ref(null);
const isOnAir = ref(false);
const stun = {
  iceServers: [
    {
      urls: [
        "stun:stun.l.google.com:19302",
        "stun:stun1.l.google.com:19302",
        "stun:stun2.l.google.com:19302",
        "stun:stun3.l.google.com:19302",
        "stun:stun4.l.google.com:19302",
      ],
    },
  ],
};

const joinRoom = () => {
  ing.value = true;
  socket.emit("joinRoom", socket.id, roomName.value);
};
// 들어온 유저 수
socket.on("users", async (users) => {
  usersArr.value = users;
});

socket.on("joined_room", async (isMasterValue) => {
  // 방송 시작자인지 여부에 따른 분기처리
  if (isMasterValue) {
    isMaster.value = true;
    await getUserVideo();
    isOnAir.value = true;
  } else {
    isMaster.value = false;
    isOnAir.value = false;
    waitingText.value = true;
    connectionSocket();
  }
});

const connectionSocket = async () => {
  // 방송자 입장에서 offer를 받을 때
  const offer = await myPeerConnection.value.createOffer({
    offerToReceiveVideo: false,
    offerToReceiveAudio: false,
  });
  // LocalDescription 설정
  myPeerConnection.value.setLocalDescription(new RTCSessionDescription(offer));
  console.log("1. sendOffer");
  // 생성한 offer를 상대방에게 송신
  socket.emit("senderOffer", offer, roomName.value);
};

socket.on("senderAnswer", (answer, allUsers) => {
  console.log("4. get answer");
  console.log("answer : ", answer);
  console.log("");
  // 받은 Answer를 RTCPeerConnection에 RemoteDescription 설정
  myPeerConnection.value.setRemoteDescription(answer);
  for (const userid of Object.keys(allUsers)) {
    createReceivePC(userid);
  }
});
socket.on("sendercandidateanswer", async (candidate) => {
  myPeerConnection.value.addIceCandidate(new RTCIceCandidate(candidate));
});
socket.on("enterUser", (receiverId) => {
  createReceivePC(receiverId);
});
socket.on("getReceiverAnswer", async (answer, receiverId) => {
  try {
    await receiveUsers.value[receiverId].pc.setRemoteDescription(answer);
    console.log("answer : ", answer);
  } catch (error) {
    console.log(error);
  }
});

socket.on("getReceiverCandidate", async (receiverId, candidate) => {
  try {
    let pc = receiveUsers.value[receiverId].pc;
    if (candidate) {
      return await pc.addIceCandidate(new RTCIceCandidate(candidate));
    }
  } catch (error) {
    console.log(error);
  }
});

onMounted(async () => {
  myPeerConnection.value = new RTCPeerConnection(stun);
  myPeerConnection.value.onicecandidate = (e) => {
    if (e.candidate) {
      socket.emit("senderCandidate", e.candidate, roomName.value);
    }
  };
});

const getUserVideo = async (deviceID) => {
  const initialConstrains = {
    video: {
      facingMode: "user",
    },
    width: { ideal: 1280 },
    height: { ideal: 720 },
    audio: true,
  };

  const cameraConstraints = {
    video: {
      deviceId: {
        exact: deviceID,
      },
      facingMode: "user",
      width: { ideal: 1280 },
      height: { ideal: 720 },
    },
    audio: true,
  };

  navigator.mediaDevices.userMedia =
    navigator.mediaDevices.getUserMedia ||
    navigator.mediaDevices.webkitGetUserMedia ||
    navigator.mediaDevices.mozGetUserMedia ||
    navigator.mediaDevices.msGetUserMedia;
  myStream.value = await navigator.mediaDevices.userMedia(
    cameraConstraints ? cameraConstraints : initialConstrains
  );
  console.log("myStream.value", myStream.value);
  console.log(
    "navigator.mediaDevices",
    await navigator.mediaDevices.enumerateDevices()
  );
  localVideoRef.value.srcObject = myStream.value;
};

const createReceivePC = (receiverId) => {
  if (!receiveUsers.value[receiverId]) {
    receiveUsers.value[receiverId] = {};
  }
  receiveUsers.value[receiverId].pc = createReceiverPC(receiverId);
  createReceiverOffer(receiverId);
};
const createReceiverPC = (receiverId) => {
  const pc = new RTCPeerConnection(stun);
  pc.onicecandidate = (e) => {
    if (e.candidate) {
      socket.emit(
        "receiverCandidate",
        e.candidate,
        socket.id,
        receiverId,
        roomName.value
      );
    }
  };
  pc.ontrack = (e) => {
    console.log(e.streams[0].getTracks());
    waitingText.value = false;
    receiveUsers.value[receiverId].stream = e.streams[0];
  };
  return pc;
};
const createReceiverOffer = async (receiverId) => {
  // 상대방 입장에서 offer를 받을 떄
  const offer = await receiveUsers.value[receiverId].pc.createOffer({
    offerToReceiveAudio: true,
    offerToReceiveVideo: true,
  });
  await receiveUsers.value[receiverId].pc.setLocalDescription(
    new RTCSessionDescription(offer)
  );
  socket.emit("receiverOffer", offer, receiverId, socket.id, roomName.value);
};

const startBroadcast = async () => {
  await startRecording();
};
const recordRTC = ref(null);

const startRecording = async () => {
  isRecording.value = true;
  recordRTC.value = RecordRTC(myStream.value, { type: "video" });
  recordRTC.value.startRecording();
};

const stopBroadcast = async () => {
  // 녹화 중지
  await stopRecording();
  ing.value = false;
  // 여기에 방송 종료 시 필요한 로직 추가
};

const stopRecording = async () => {
  isRecording.value = false;
  if (recordRTC.value) {
    recordRTC.value.stopRecording(() => {
      const blob = recordRTC.value.getBlob();
      recordRTC.value.save("recorded-video.mp4");

      // 여기에서 파일 다운로드 등 추가 로직을 수행할 수 있습니다.
      // 예: 파일을 자동으로 다운로드
      const downloadLink = document.createElement("a");
      downloadLink.href = URL.createObjectURL(blob);
      downloadLink.download = "recorded-video.mp4";
      downloadLink.click();
    });
  }
};

const findDevice = () => {
  navigator.mediaDevices.enumerateDevices().then((allDevices) => {
    devices.value = allDevices.filter((v) => v.kind == "videoinput");
  });
};

const selectDevice = async (e) => {
  console.log("e : ", e);
  await getUserVideo(e);
  console.log(myPeerConnection.value);
  if (myPeerConnection.value != null) {
    const videoTrack = myStream.value.getVideoTracks()[0];
    const videoSender = myPeerConnection.value
      .getSenders()
      .find((sedner) => sedner.track.kind === "video");
    videoSender.replaceTrack(videoTrack);
  }
};

const startBroadcasting = () => {
  myStream.value.getTracks().forEach((track) => {
    console.log(TrackEvent);
    myPeerConnection.value.addTrack(track, myStream.value);
  });
  connectionSocket();
};

const stopBroadcasting = () => {
  // 이벤트 리스너를 미리 등록
  const handleBroadcastEnded = () => {
    console.log("여기오니?");
    location.reload();
  };

  // 방송 종료 이벤트 전송
  socket.emit("webdisconnecting", roomName);

  // 한 번만 실행되고 이후에는 제거되는 이벤트 리스너 등록
  socket.once("broadcastEnded", handleBroadcastEnded);
  myPeerConnection.value.close();
  doneRecording.value = true;
};
</script>

<template>
  <div>
    <div>
      <button v-if="!isOnAir" @click="joinRoom">방 참가</button>
      <button v-if="isMaster" @click="startBroadcasting">방송시작</button>
      <button v-if="isMaster" @click="startBroadcast">녹화시작</button>
      <button v-if="isMaster" @click="stopBroadcast">녹화중지</button>
      <button v-if="isMaster" @click="stopBroadcasting">방송종료</button>
    </div>
    <div>
      <button v-if="isMaster" @click="findDevice">장치 가져오기</button>
      <select
        v-if="devices != null"
        @change="selectDevice($event.target.value)"
      >
        <template v-for="device of devices" :key="device.deviceId">
          <option
            :value="device.deviceId"
            :selected="myStream.getVideoTracks()[0].label == device.label"
          >
            {{ device.label }}
          </option>
        </template>
      </select>
    </div>
    <video ref="localVideoRef" autoplay playsinline muted></video>
    <img v-if="waitingText" src="../assets/waiting.png" class="waitingImg" />
    <template v-for="(userInfo, userid) of receiveUsers" :key="userid">
      <video
        :srcObject="userInfo.stream"
        autoplay
        playsinline
        class="video"
      ></video>
      <p v-if="ing" class="word">생방송 중 입니다.</p>
      <p v-if="ing" class="word">시청자 수 : {{ usersArr.length - 1 }}명</p>
      <p v-if="isRecording" class="word">녹화 중 입니다.</p>
    </template>
  </div>
</template>

<style scoped>
.word {
  color: red;
  font-weight: bolder;
  font-size: 30px;
  margin-left: 800px;
}

.video {
  width: 1500px;
  height: 800px;
  margin-left: -100px;
}

#id {
  width: 1850px;
  height: 800px;
  margin-left: -100px;
}

body {
  background-color: black;
}

.waitingImg {
  width: 1500px;
  height: 800px;
  margin-left: -100px;
}
</style>
