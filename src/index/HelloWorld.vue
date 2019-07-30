<template>
  <div class="header">
    <el-header style="padding: 0px">
      <el-row>
        <div class="top">
          <el-col :span="5" style="height: 100% ; background-color: #4794E2">
            <img src="../assets/70319f7290452f66e9cc7d236f5133d.png" style="height: 100%;width: 100%"/>
          </el-col>
          <el-col :span="12" style="height: 100% ; background-color: #3A8EE6 ">
          </el-col>
          <el-col :span="7" style="height: 100% ; background-color: #3A8EE6">
            <el-dropdown style="margin-top: 5%!important; margin-right: 30%!important">
              <span class="el-dropdown-link" style="display: inline-block">欢迎你:&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{{name}}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item><span @click="out">退出登录</span></el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </el-col>
        </div>
      </el-row>
    </el-header>
    <el-main>
      <el-row>
        <el-col :span="6">
          <el-tree :data="data" :props="defaultProps" @node-click="handleNodeClick"></el-tree>
        </el-col>
        <el-col :span="18">
          <router-view></router-view>
        </el-col>
      </el-row>
    </el-main>
  </div>
</template>

<script>
  import storageUtil from '../util/storageUtil'
  import {userLogout} from '../api'

  export default {
    name: 'HelloWorld',
    data() {
      return {
        data: [
          {
            id: 1,
            label: '基础服务',
            children: [
              {
                id: 2,
                label: '用户管理',
                path: 'User'
              },
              {
                id: 3,
                label: '菜单管理',
                path: 'Menu'

              },
              {
                id: 4,
                label: '角色权限管理',
                path: 'Auth'
              }
              , {
                id: 5,
                label: '字典管理',
                path: 'Dictionaries'
              }
              , {
                id: 6,
                label: '地区管理',
                path: 'Region'
              }
            ]
          },
          {
            id: 7,
            label: '数据统计',
            children: [{
              id: 8,
              label: '采集数据',
              path: 'Gather'

            }]
          },
          {
            id: 9,
            label: '公众号菜单管理',
            path: 'Accounts'

          },
          {
            id: 10,
            label: '采集人员管理',
            path: 'Gatheruser',
          }
        ],
        defaultProps: {
          children: 'children',
          label: 'label'
        },
        name: '',
        //deptname: '',
      };
    },
    methods: {
      //路由跳转
      handleNodeClick(data) {
        console.log(data);
        this.$router.push({
          name: data.path,
          params: {
            id: data.id
          }
        });
      },
      getRouterData() {
        this.name = this.$route.params.name;
      },
      //退出
      out() {
        this.$confirm('确定要退出系统吗?', '提示',
                {
                  confirmButtonText: '确定',
                  cancelButtonText: '取消',
                  type: 'warning'
                }).then(() => {
          this.userLogout();
        }).catch(() => {
        });
      },
      //退出登录
      async userLogout() {
        try {
          let result = await userLogout("GET");
          if (result.code == 0) {
            //    清除本地sessionId
            //storageUtil.save("sessionId", "");
            this.$message.success('退出成功');
            this.$router.replace("/");
          }
          else {
            this.$message.error('退出失败');
          }
        } catch (e) {
          alert(e.message);
          this.$message.error('系统异常，请联系管理员');
        }
      }
    },
    mounted() {
      this.name = storageUtil.read('loginName');
      //this.deptname = storageUtil.read('deptName');
    },
  };
</script>
<style>
  .top {
    height: 60px;
    width: 100%;
    background-color: blue;
    padding: 0px;
  }

  .el-dropdown-link {
    font-size: 18px;
    color: antiquewhite;
  }

  img {
    width: 100px;
    height: 30px;
    float: left;
  }
</style>