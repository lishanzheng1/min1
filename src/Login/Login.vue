<template>
  <div class="bg">
    <el-form label-position="left" label-width="0px" class="login-container" :rules="rules" :model="ruleForm" ref="ruleForm">
      <!--<img src="./images/logo.png" width="100%"/>-->
      <!--<h2 class="title">吉林省民政厅留守老人数据采集系统</h2>-->
      <el-form-item >
        <div class="aa">
        </div>
      </el-form-item>
      <p style="text-align: left">账号密码登录</p>
      <el-form-item prop="loginName">
        <el-input type="text" auto-complete="off" placeholder="账号" v-model="ruleForm.loginName"></el-input>
      </el-form-item>
      <el-form-item prop="loginPwd" style="margin-top: 25px">
        <el-input type="password" auto-complete="off" placeholder="密码" v-model="ruleForm.loginPwd"></el-input>
      </el-form-item>

      <el-form-item style="width:100%;">
        <el-button type="primary" style="width:100%;" @click="login" :loading="logining">登录</el-button>
      </el-form-item>
    </el-form>
  </div>

</template>

<script>
  import { userLogin,queryUser } from '../api'
  import storageUtil from '../util/storageUtil'
  export default {
    data () {
      return {
        logining: false,
        ruleForm : {
          loginName: '',
          loginPwd: ''
        },
        deptName:"",
        rules: {
          loginName: [
            { required: true, message: '请输入账号', trigger: 'blur' }
          ],
          loginPwd: [
            { required: true, message: '请输入密码', trigger: 'blur' }
          ]
        }
      }
    },
    methods: {
      async queryUser1(loginName) {
        try {
          let result = await queryUser({loginName: loginName}, 'GET');
          if (result.code == "0") {
              console.log(result);
            this.deptName = result.data[0].dept.name;
            storageUtil.save("deptName", this.deptName);
            console.log("sssssssss",storageUtil.read('deptName'));
            this.$router.replace("/home");
          } else {
            this.$message.error('查询用户失败');
          }
        } catch (e) {
          alert(e.message);
          this.$message.error('系统异常，请联系管理员');
        }
      },


      async login () {
        let bool = false;
        this.$refs.ruleForm.validate((valid) => {
          bool = valid;
        });
        if(!bool){
          return;
        }
        this.logining = true;
        try{
          let result = await userLogin(this.ruleForm, "GET");
          if(result.code == "0"){
            storageUtil.save("sessionId", result.data)
            storageUtil.save("loginName", this.ruleForm.loginName);
            this.queryUser1(this.ruleForm.loginName);


          } else {
            this.$message.error('登录失败，请核对账号和密码');
            this.logining = false;
          }
        } catch (e) {
          alert(e.message);
          this.$message.error('系统异常，请联系管理员');
          this.logining = false;
        }
      }
    }
  }
</script>

<style type="text/css">
  *{
    margin:0;
    padding:0;
  }
  .bg{
    height:100vh;
    background: url('../assets/4ef7b0258ce5a7f4f4e133d6c2b0814.png');
    background-size:100% 100%;
  }
  .login-container {
    -webkit-border-radius: 5px;
    border-radius: 5px;
    -moz-border-radius: 5px;
    background-clip: padding-box;
    position: absolute;
    width: 400px;
    height:380px;
    top:0;
    left:0;
    bottom:0;
    right:0;
    margin: auto;
    padding: 35px 35px 15px 35px;
  }
  .login-container > p{
    margin-bottom:10px;
    color:#666
  }
  .title {
    margin: 5px auto 15px;
    text-align: center;
    color: #001529;
    padding-top:5px;
    border-top:1px solid #ccc;
  }
  .remember {
    margin: 0 0 35px 0;
  }
  .el-checkbox__input.is-checked .el-checkbox__inner, .el-checkbox__input.is-indeterminate .el-checkbox__inner{
    background-color: #f78989;
    border-color: #F56C6C;
  }
  .el-checkbox__input.is-checked+.el-checkbox__label{
    color:#F56C6C
  }
  .el-checkbox__input.is-focus .el-checkbox__inner{
    border-color:#F56C6C;
  }
  .aa {
    box-sizing: border-box;
    width: 400px ;
    height: 200px;
    background: url("../assets/d33253cf28752ec3b2be854e4043ea5.png") ;
    background-size: 100%,100%;
  }
</style>