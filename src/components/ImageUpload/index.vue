<template>
  <div>
    <!-- file-list是上传的文件列表，可以绑定到上传组件上，让上传组件来显示 -->
    <el-upload
      list-type="picture-card"
      :limit="1"
      action="#"
      :on-preview="preview"
      :on-remove="handleRemove"
      :on-change="changeFile"
      :before-upload="beforeUpload"
      :http-request="upload"
      :file-list="fileList"
      :class="{ disabled: fileComputed }"
    >
      <i class="el-icon-plus"></i>
    </el-upload>
    <el-progress
      :percentage="percent"
      style="width: 180px"
      v-if="showPercent"
    ></el-progress>
    <el-dialog :visible.sync="showDialog" title="图片预览">
      <img :src="imgUrl" alt="" style="width: 100%" />
    </el-dialog>
  </div>
</template>

<script>
import COS from "cos-js-sdk-v5"; //引入腾讯云Cos包
const cos = new COS({
  SecretId: "AKIDNaWBZgW4LM6ZkeHdhU1HGxOYR2NSFl0z", //身份识别ID
  SecretKey: "jBMHvIOEm33mEPIuGK7crpVu2tSklVy9", //身份密钥
});
export default {
  data() {
    return {
      percent: 0, //当前的百分比
      showPercent: false,
      fileList: [
        // {
        //   url: "https://t7.baidu.com/it/u=1595072465,3644073269&fm=193&f=GIF",
        // },
      ],
      showDialog: false,
      imgUrl: "",
      currentFileUid: null, //记录当前正在上传的Uid
    };
  },
  computed: {
    //如果他为true 表示就不应该显示加号
    fileComputed() {
      return this.fileList.length === 1;
    },
  },
  methods: {
    preview(file) {
      this.imgUrl = file.url;
      this.showDialog = true;
    },
    handleRemove(file, fileList) {
      //file是要删除的文件
      //fileList是删过的文件
      this.fileList = this.fileList.filter((item) => item.uid !== file.uid); //将当前的删除文件排除在外
      // this.fileList = fileList;
    },
    changeFile(file, fileList) {
      this.fileList = fileList.map((item) => item);
      //这里不成功 上传成功后数据才能进来
    },
    beforeUpload(file) {
      const types = ["image/jpeg", "image/gif", "image/bmp", "image/png"];
      if (!types.some((item) => item === file.type)) {
        //如果不存在
        this.$message.error("上传图片只能是JPG、GIF、BMP、PNG格式！");
        return false;
      }
      //检查文件大小 5M
      const maxSize = 5 * 1024 * 1024;
      if (file.size > maxSize) {
        this.$message.error("上传的图片大小不能大于5M");
        return false;
      }
      this.currentFileUid = file.uid;
      this.showPercent = true;
      return true;
    },
    upload(params) {
      if (params.file) {
        //执行上传操作
        cos.putObject(
          {
            //上传到腾讯云
            Bucket: "wayne-1312895701", // 存储桶
            Region: "ap-nanjing", // 地域
            Key: params.file.name, // 文件名
            Body: params.file, //要上传的文件对象
            StorageClass: "STANDARD", //上传的模式类型 默认标准模式
            onProgress: (params) => {
              this.percent = params.percent * 100;
            },
          },
          (err, data) => {
            //data中有一个statusCode == 200 说明上传成功
            if (!err && data.statusCode === 200) {
              //此时说明文件上传成功

              this.fileList = this.fileList.map((item) => {
                //去找谁的uid等于刚刚记录下来的id
                if (item.uid === this.currentFileUid) {
                  //将成功的地址赋值给原来的url属性
                  return { url: "http://" + data.Location, upload: true };
                }
                return item;
              });
              //关闭进度条，重置百分比
              setTimeout(() => {
                this.showPercent = false;
                this.percent = 0;
              }, 500);
            }
          }
        );
      }
    },
  },
};
</script>

<style>
.disabled .el-upload--picture-card {
  display: none;
}
</style>