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
              <span class="el-dropdown-link" style="display: inline-block">欢迎你:&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{{name}}&nbsp;&nbsp;&nbsp;{{deptName}}</span>
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
          <!--<el-tree :data="data2"
                   node-key="_id"
                   ref="tree"
                   :props="defaultProps"
          >
          </el-tree>-->
          <el-tree :data="data2" :props="defaultProps" @node-click="handleNodeClick"></el-tree>
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
  import {userLogout,queryMenuForList,loginerRoleMenu} from '../api'
  export default {
    name: 'HelloWorld',
    data() {
      return {
        roleMenu:[],
        data2 :[],
        tList:[],
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
          label: 'name'
        },
        name: '',
        deptName: '',
      };
    },
    methods: {
      //路由跳转
        handleNodeClick(data) {
        console.log(data);
        this.$router.push({path:data.address
         /* name: data.path,
          params: {
            id: data.id
          }*/
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
            storageUtil.save("sessionId", "");
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
      },
      async queryMenuForList(myMenu) {
          console.log("157",myMenu);
        try {
          let result = await queryMenuForList();
          if (result.code === 0) {
            this.data2 = result.data;
            for (let i = 0; i <this.data2.length ; i++) {
              if (this.data2[i].fid === '0'){
                this.data2[i].children=[];
                  for (let j = 0; j < myMenu.length; j++) {
                      if (this.data2[i]._id == myMenu[j].id){
                          this.tList.push(this.data2[i]);
                      }
                  }
                console.log("170",this.tList);
                //console.log("1111",this.defaultCheckedKeys);
              }else {//fid != 0 a1   [a1]
                for (let j = 0; j < this.tList.length; j++) {
                  if (this.tList[j]._id === this.data2[i].fid){
                      this.tList[j].children.push(this.data2[i]);
                  }
                }
              }
            }
            console.log("00000000000",this.tList);

            this.data2 =  this.tList;
            console.log("zzzz",this.data2);
            //this.queryMenuForList();
          }
        } catch (e) {
          alert(e.message);
          this.$message.error('系统异常，请联系管理员');
        }
      },
      async loginerRoleMenu1(sessionId) {
        try {
          let result = await loginerRoleMenu({sessionId: sessionId}, 'GET');
          if (result.code == "0") {
            console.log(result.data.roleMenu);
            //查找出roleMenu
            this.roleMenu= result.data.roleMenu;
            console.log("190",this.roleMenu);
            this.queryMenuForList(this.roleMenu);
           /* this.deptName = result.data[0].dept.name;
            storageUtil.save("deptName", this.deptName);*/

          } else {
            this.$message.error('查询用户失败');
          }
        } catch (e) {
          alert(e.message);
          this.$message.error('系统异常，请联系管理员');
        }
      },


    },
    mounted() {
      this.name = storageUtil.read('loginName');
      this.deptName = storageUtil.read('deptName');
      console.log(this.deptName);
      //新
      this.loginerRoleMenu1(storageUtil.read('sessionId'));
     //this.queryMenuForList();
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