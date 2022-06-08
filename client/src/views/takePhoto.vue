<template>
  <!-- <div class="nofind">
    <img src="@/assets/404.gif" alt="">
  </div> -->
  <div>
    <div @click="cameraPreviewOpen()">
      <button>点击拍照</button>
    </div>
    <CameraPreview
      v-if="cameraPreviewVisible"
      name="cameraPreview"
      ref="cameraPreview"
      @refreshCameraPhoto="refreshCameraPhoto"
    ></CameraPreview>
  </div>
</template>

<script>
// export default {
//   name: "404",
//   data() {
//     return {};
//   },
//   components: {},
//   created() {},
//   mounted() {},
//   methods: {},
// };
import CameraPreview from "@/components/cameraPreview.vue";
export default {
  data() {
    return {
      cameraPreviewVisible: false,
      picValueZero: "",
    };
  },
  components: {
    CameraPreview,
  },
  methods: {
    cameraPreviewOpen(cameraType) {
      this.cameraPreviewVisible = true;
      this.$nextTick(() => {
        this.$refs.cameraPreview.init();
      });
    },
    refreshCameraPhoto(cameraPhoto) {
      console.log(cameraPhoto);
      // let httpZp;
      // this.$http
      //   .post("/uploadImage", {
      //     params: {
      //       imageFile: cameraPhoto,
      //     },
      //   })
      //   .then(({ data: res }) => {
      //     if (res.code !== 0) {
      //       return this.$message.error(res.msg);
      //     }
      //     httpZp = res.data.src;
      //     this.picValueZero = cameraPhoto;
      //   })
      //   .catch(() => {});
    },
  },
};
</script>

<style lang="scss" scoped>
.nofind {
  width: 100%;
  height: 100%;
  overflow: hidden;
}
.nofind img {
  width: 100%;
  height: 100%;
}
</style>
