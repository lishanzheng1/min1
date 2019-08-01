<template>
    <div class="el-main">
        <el-row >
            <el-breadcrumb separator-class="el-icon-arrow-right">
                <el-breadcrumb-item :to="{ path: '/hello' }">基础服务</el-breadcrumb-item>
                <el-breadcrumb-item >角色权限管理</el-breadcrumb-item>
            </el-breadcrumb>
        </el-row>
        <el-row style="margin: 20px 0 0 0 ; float: left">
            <em>角色名称</em>
            <el-input placeholder="角色权限管理" v-model="input" clearable style="width: 200px">用户名</el-input>
            <el-button type="primary" @click="selectUser">查询</el-button>
        </el-row>
        <el-table :data="list">
            <el-table-column label="序号" type="index" width="50">
            </el-table-column>
            <el-table-column prop="name" label="角色名称" sortable>
            </el-table-column>
            <el-table-column label="操作">
                <template slot-scope="scope">
                    <el-button  type="primary"  icon="el-icon-setting"
                                @click="handleEdit(scope.$index, scope.row)"></el-button>
                </template>
            </el-table-column>
        </el-table>
        <pages
                :total='total'
                :currentPage='currentPage'
                :pageSize='pagesize'
                @handleCurrentChangeSub="handleCurrentChange"
        ></pages>
        <el-dialog  title="设置权限" :visible.sync="dialogFormVisible">
            <el-tree :data="data2"
                     show-checkbox
                     node-key="_id"
                     ref="tree"
                     :props="defaultProps"
                     :default-expanded-keys ="defaultExpandedKeys"
                     :default-checked-keys= "defaultCheckedKeys"
            >
            </el-tree>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogFormVisible = false">取 消</el-button>
                <el-button type="primary" @click="add">确 定</el-button>
            </div>
        </el-dialog>
    </div>
</template>
<script>
    import ElRow from "element-ui/packages/row/src/row";
    import ElButton from "../../node_modules/element-ui/packages/button/src/button.vue";
    import ElCol from "element-ui/packages/col/src/col";
    import {queryRoleForPage} from '../api';
    import {queryRoleOne  } from '../api';
    import {roleUpdate} from '../api';
    import {queryMenuForList  } from '../api';
    export default {
        components: {
            ElCol,
            ElButton,
            ElRow
        },
        data() {
            return {
                defaultProps: {
                    children: 'children',
                    label: 'name'
                },
                data2 :[],
                tList:[],
                input: '',
                index: '',
                list: [],
                roleMenu : [],
                defaultCheckedKeys:[],
                defaultExpandedKeys:[],
                total: 5,
                pagesize: 5,
                currentPage: 1,
                id: '',
                dialogFormVisible :false
            }
        },
        methods: {
            //设置权限  显示
            handleEdit(index, row) {
                this.dialogFormVisible = true;
                console.log(index);
                this.id = row._id;
                this.tList= [];
                //点击出树 父子形状
                this.queryMenuList();
                console.log("1111111111111111111111",this.list[index]);
                this.roleMenu =JSON.parse(this.list[index].roleMenu);
                console.log("000000000",this.roleMenu);
                //console.log("1111",this.defaultCheckedKeys);
                this.defaultCheckedKeys = this.roleMenu.map((a,b) =>{
                    return a.id;
                });
               /* this.defaultExpandedKeys = this.roleMenu.map((a,b) =>{
                    return a.id;
                });*/
                console.log("222",this.defaultCheckedKeys);
            },
            // 查询
            selectUser() {
                console.log(this.input);
                this.currentPage = 1;
                this.queryRoleForPage(this.input);

            },
            filterHandle(value, row) {
                return this.input === row.name;
            },
            handleSizeChange: function (size) {
                this.pagesize = size;
                console.log(this.pagesize)
            },
            handleCurrentChange: function (currentPage) {
                this.currentPage = currentPage;
                console.log(this.currentPage);
                this.queryRoleForPage(this.input);
            },
            //角色查询
            async queryRoleForPage(queryName) {
                try {
                    let result = await queryRoleForPage({
                        queryName: queryName,
                        page: this.currentPage,
                        rows: this.pagesize
                    }, "GET");
                    if (result.code == 0) {
                        console.log(result.data);
                        this.list = result.data.list;
                    }
                    else {
                        this.$message.error('获取列表失败');
                    }
                } catch (e) {
                    alert(e.message);
                    this.$message.error('系统异常，请联系管理员');
                }
            },
            //通过id 修改
            async roleUpdate1(id,roleMenu) {
                console.log(id);
                try {
                    let result = await roleUpdate({
                            id : id,
                            roleMenu : roleMenu,

                    }, "POST");
                    if (result.code == 0) {
                        //this.list = result.data;
                        this.queryRoleForPage(this.input);
                        this.$message.success('修改成功');
                    }
                    else {
                        this.$message.error('获取列表失败');
                    }
                } catch (e) {
                    alert(e.message);
                    this.$message.error('系统异常，请联系管理员');
                }
            },
            //单条查询  通过id修改
            async queryRoleOne(id) {
                console.log(id);
                try {
                    let result = await queryRoleOne({id : id}, "GET");
                    console.log(result+"单的id");
                    if (result.code == 0) {
                        this.list = result;
                    }
                    else {
                        this.$message.error('获取列表失败');
                    }
                } catch (e) {
                    alert(e.message);
                    this.$message.error('系统异常，请联系管理员');
                }
            },
            //详情菜单
            async queryMenuList() {
                try {
                    let result = await queryMenuForList();
                    if (result.code === 0) {
                        this.data2 = result.data;
                        for (let i = 0; i <this.data2.length ; i++) {
                            if (this.data2[i].fid === '0'){
                                this.data2[i].children=[];
                                this.defaultExpandedKeys.push(this.data2[i]._id);
                                this.tList.push(this.data2[i]);//
                                console.log("111111111",this.tList);
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
                    }
                } catch (e) {
                    alert(e.message);
                    this.$message.error('系统异常，请联系管理员');
                }
            },
            resetChecked() {
                this.$refs.tree.setCheckedKeys([]);
            },
            add(){
                let rad='';
                let ridsa = this.$refs.tree.getCheckedKeys().join(',');// 获取当前的选中的数据[数组] -id, 把数组转换成字符串
                let ridsb = this.$refs.tree.getCheckedNodes();// 获取当前的选中的数据{对象}
                let ridsc = this.$refs.tree.getHalfCheckedNodes	();
                console.log("221",ridsa);
                console.log("222",ridsb);
                console.log("223",ridsc);
                ridsb.forEach(ids=>{//获取选中的所有的父级id
                    rad+=','+ids.pid
                });
            console.log(ridsb[0]._id);
//                console.log(ridsb.length);
                let  nodeId=[];
                for (let i=0;i<ridsb.length;i++)
                {      let rid=ridsb[i];
                    nodeId.push({id:rid._id,type:"Checked"});
//                     nodeId.type.push("Checked");
                }
                console.log('nodeID',nodeId);
                console.log('ID',this.id);
                console.log(nodeId);
                this.roleUpdate1(this.id, JSON.stringify(nodeId));
                this.dialogFormVisible = false;
            },

        },
        async mounted() {
            this.queryRoleForPage(this.input);
     /*       try {
                let result =  await queryMenuForList();
                if (result.code === 0 ){
                    this.data2 = result.data;
                }
            }catch (e) {
                alert(e.message);
                this.$message.error('系统异常，请联系管理员');
            }
*/

        },
    }
</script>
<style>
    .el-main {
    }

    .el-main button {
        margin-left: 20px !important;
    }

    em {
        font-style: normal;
        margin-right: 10px;
    }

    /*.el-table td,el-table th{*/
    /*text-align: center!important;*/
    /*}*/

</style>
