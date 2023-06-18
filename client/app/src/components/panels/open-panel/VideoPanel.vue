<template>
  <div>
    <video id="video" class="openPanelContainer" autoplay controls>
      <source :src="file.location" />
      <track
        label="English"
        kind="subtitles"
        srcland="en"
        src=""
        default
        ref="subtitles"
      />
    </video>
  </div>
</template>

<script>
import createFileHash from "@/helpers/createFileHash.js";
import axios from "axios";
import srtToVttConverter from "@/helpers/srtToVttConverter";
const LOCALSTORAGE_NAME = "video-resume-location";
const IGNORED_ZONE = 120; // dont save first and last 2mins of video

let fileHash = "";
let localstorageUpdateInterval;
export default {
  name: "VideoPanel",
  components: {},
  props: ["file"],
  methods: {
    updateResumeLocation: function (fileHash) {
      // get localstorage data
      let localStorageItem = this.getLocalStorageItem();

      // get video stats
      const currentLocation = Math.floor(
        document.getElementById("video").currentTime
      );
      const duration = document.getElementById("video").duration;

      // if video is at the first or last 2mins
      if (
        currentLocation < IGNORED_ZONE ||
        duration - currentLocation < IGNORED_ZONE
      ) {
        delete localStorageItem[fileHash];
      } else {
        localStorageItem[fileHash] = currentLocation;
      }
      // update localstorage with data
      this.setLocalStorageItem(localStorageItem);
    },
    restoreResumeLocation: function (fileHash) {
      // jump to saved playback location
      let localStorageItem = this.getLocalStorageItem();
      let resumeLocation = localStorageItem[fileHash];
      // if file locaion has been saved to localstorage
      if (resumeLocation) {
        // go back 10 seconds from saved location
        resumeLocation -= 10; // 10 seconds
        document.getElementById("video").currentTime = resumeLocation;
      }
    },
    getLocalStorageItem: function () {
      // get localstorage item or return empty json string
      let localStorageItem = localStorage.getItem(LOCALSTORAGE_NAME) || "{}";
      localStorageItem = JSON.parse(localStorageItem);
      return localStorageItem;
    },
    setLocalStorageItem: function (json) {
      let item = JSON.stringify(json);
      localStorage.setItem(LOCALSTORAGE_NAME, item);
    },
  },
  mounted() {
    // create file hash from its name to identify it in localstorage
    fileHash = createFileHash(this.file);
    this.restoreResumeLocation(fileHash);

    const subtitleLocation = this.file.location.replace(/\.[^/.]+$/, ".srt");
    axios
      .get(subtitleLocation)
      .then((res) => {
        const vttContent = srtToVttConverter(res.data);

        // Create blob from generated vtt subtitles
        const srtBlob = new Blob([vttContent], { type: "text/plain" });

        // Create virtual url for blob
        const srtBlobURL = URL.createObjectURL(srtBlob);
        // set video subtitle to blob url
        this.$refs.subtitles.src = srtBlobURL;
      })
      .catch(() => {
        // remove subtitles button if no subtitles found
        this.$refs.subtitles.remove();
      });

    // every minute update last location
    localstorageUpdateInterval = setInterval(() => {
      this.updateResumeLocation(fileHash);
    }, 60_000);
  },
  beforeUnmount() {
    this.updateResumeLocation(fileHash);
    clearInterval(localstorageUpdateInterval);
  },
};
</script>
