<template>
    <div class="el-main">
        <el-row style="float: left">
            <el-breadcrumb separator-class="el-icon-arrow-right">
                <el-breadcrumb-item :to="{ path: '/hello' }">基础服务</el-breadcrumb-item>
                <el-breadcrumb-item v-for="(tops,index) in toplist" @click="topclick(index)">{{tops.name}}</el-breadcrumb-item>
            </el-breadcrumb>
        <!--    <li>基础服务</li>
            <li v-for="(tops,index) in toplist" @click="topclick(index)">>{{tops.name}}</li>-->
        </el-row>
        <el-table :data="list">
            <el-table-column label="序号" type="index" width="50">
            </el-table-column>
            <el-table-column prop="name" label="地区名称" sortable>
            </el-table-column>
            <el-table-column label="操作">
                <template slot-scope="scope">
                    <el-button  type="primary" icon="el-icon-search"
                               @click="handleEnd(scope.$index, scope.row)"></el-button>
                    <el-button  type="info"  icon="el-icon-edit"
                               @click="handleEdit(scope.$index, scope.row)"></el-button>
                    <el-button  icon="el-icon-delete"  type="danger"
                               @click="handleDelete(scope.$index, scope.row)"></el-button>
                </template>
            </el-table-column>
        </el-table>
        <el-button style="float: left" type="primary" size="medium" @click="adduser">新增</el-button>
        <pages :total='total' :currentPage='currentPage' :pageSize='pagesize'
               @handleCurrentChangeSub="handleCurrentChange">
        </pages>
        <el-dialog title="创建地区" :visible.sync="dialogFormVisible">
            <el-form :model="form">
                <el-form-item label="地区名称" :label-width="formLabelWidth">
                    <el-input v-model="form.name" autocomplete="off"></el-input>
                </el-form-item>
            </el-form>
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
    import {queryDeptForPage} from '../api'
    import {deptInsert} from '../api'
    import {deptDelete} from '../api'
    import {queryDeptOne,queryDeptList} from '../api'
    import {deptUpdate} from '../api'
    import {userInfo,queryUserOne} from '../api'
    import storageUtil from '../util/storageUtil'
        export default {
            components: {
                ElCol,
                ElButton,
                ElRow
            },
            data() {
                return {
                    input: '',
                    dialogFormVisible: false,
                    form: {
                        name: '',
                        password: '',
                        state: '',
                        address: '',
                        role: '',
                        fid: '',
                        _id: ''
                    },
                    toplist: [{
                        fid: '0',
                        name: '地区管理'
                    }
                    ],
                    index: '',
                    deptName : "",
                    formLabelWidth: '120px',
                    update: false,
                    list: [],
                    total: 1000,//默认数据总数
                    pagesize: 10,//每页的数据条数
                    currentPage: 1,//默认开始页面
                    id: '',
                    fid: 0,
                }
            },
            methods: {
                //导航条点击事件
                topclick(index) {
                    let fid = this.toplist[index].fid;
                    this.fid=fid;
                    this.queryDeptForPage(fid, this.currentPage, this.pagesize);
                    let number = this.toplist.length - index;
                    this.toplist.splice(index + 1, number);
                },
                //回填
                handleEdit(index, row) {
                    this.index = index;
                    this.dialogFormVisible = true;
                    console.log(row._id);
                    this.form = row;
                    //中断form和list集合的联动，list重新获取一下数据
                    this.queryDeptForPage(this.fid, this.currentPage, this.pagesize);
                    this.update = true;
                },
                //删除
                handleDelete(index, row) {
                    this.$confirm('确定要删除该记录吗?', '提示',
                        {
                            confirmButtonText: '确定',
                            cancelButtonText: '取消',
                            type: 'warning'
                        }).then(() => {
                        this.deptDelete(row._id);
                    }).catch(() => {
                    });
                },
                adduser() {
                    //清空地区名称
                    this.form.name = "";
                    this.dialogFormVisible = true;
                },
                //修改和增加
                add() {
                    //true是修改
                    if (this.update) {
                        let tableName = this.form.name;
                        let tableId = this.form._id;
                        this.deptUpdate(tableId, tableName);
                        this.queryDeptForPage(this.form.fid, this.currentPage, this.pagesize);
                        this.update = false;
                    }
                    //false是添加
                    else {
                        let fid = this.id;
                        //判断fid是为空
                        //初始值为空代表父级
                        //有值的话代表的是子级
                        if (fid == "") {
                            fid = 0;
                        }
                        let name = this.form.name;
                        this.deptInsert(name, fid);
                        this.queryDeptForPage(this.fid, this.currentPage, this.pagesize);

                    }
                    this.dialogFormVisible = false
                },
                //查询
                selectuser() {
                },
                handleSizeChange: function (size) {
                    this.pagesize = size;
                    console.log('我是下拉的数据', this.pagesize);//每页下拉显示数据
                },
                handleCurrentChange: function (currentPage) {
                    this.currentPage = currentPage;
                    this.queryDeptForPage(this.fid, this.currentPage, this.pagesize);
                },
                //查看下一级
                handleEnd(index, row) {
                    //把id和name放进toplist 导航条根据name显示，数据根据fid查询 下一级的fid等于上一级的id
                    this.toplist.push({fid: row._id, name: row.name});
                    this.fid = row._id;
                    //把id存起来
                    this.id = this.list[index]._id;
                    this.queryDeptForPage(this.fid, this.currentPage, this.pagesize);
                },
                //分页查询数据
                async queryDeptForPage(fid, page, rows) {
                    try {
                        let result = await queryDeptForPage({fid:fid, page: page, rows: rows}, "GET");
                        console.log("187 0000000000000",result);
                        if (result.code == 0) {
                            this.list = result.data.list;
                            console.log("189 ",result.data);
                            this.total = result.data.count;
                        }
                        else {
                            this.$message.error('获取列表失败');
                        }
                    } catch (e) {
                        alert(e.message);
                        this.$message.error('系统异常，请联系管理员');
                    }
                },
                //地区增加
                async deptInsert(name, fid) {
                    try {
                        let result = await deptInsert({name: name, fid: fid}, "POST");
                        if (result.code == 0) {
                            this.$message.success('添加成功');
                        }
                        else {
                            this.$message.error('添加失败');
                        }
                    } catch (e) {
                        alert(e.message);
                        this.$message.error('系统异常，请联系管理员');
                    }
                },
                //地区删除
                async deptDelete(id) {
                    try {
                        let result = await deptDelete({id: id}, "GET");
                        if (result.code == 0) {
                            if (result.data.status === -1) {
                                this.$message.error('地区还有对应的地区，无法删除');
                            }
                            else {
                                 console.log(4444);
                            }
                            this.queryDeptForPage(this.fid, this.currentPage, this.pagesize);
                        }
                        else {
                            this.$message.error('删除失败');
                        }
                    } catch (e) {
                        alert(e.message);
                        this.$message.error('系统异常，请联系管理员');
                    }

                },
                //地区单条查询
                async querydeptOne(id) {
                    try {
                        let result = await queryDeptOne({id: id}, "GET");
                        if (result.code == 0) {
                            //this.$message.success('回填成功')
                            console.log("245",result.data.fid);
                            this.queryDeptForPage(result.data.fid,this.currentPage, this.pagesize);
                            console.log(123);
                        }
                        else {
                            this.$message.error('回填失败');
                        }
                    } catch (e) {
                        alert(e.message);
                        this.$message.error('系统异常，请联系管理员');
                    }

                },
                //地区修改
                async deptUpdate(id, name) {
                    try {
                        let result = await deptUpdate({id: id, name: name}, "POST");
                        if (result.code == 0) {
                            this.$message.success('修改成功')
                            console.log(result);
                            console.log(123);
                        }
                        else {
                            this.$message.error('修改失败');
                        }
                    } catch (e) {
                        alert(e.message);
                        this.$message.error('系统异常，请联系管理员');
                    }

                },
                //根据sessionId 查询出用户的id
                async userInfo1(sessionId) {
                    try {
                        let result = await userInfo({sessionId: sessionId}, 'GET');
                        if (result.code == "0") {
                            console.log("280",result.data.id);
                            //根据登录id 查询 dept id
                            this.queryUserOne1(result.data.id);
                            //this.queryDeptForPage(result.data.id,this.currentPage, this.pagesize);
                        } else {
                            this.$message.error('查询用户失败');
                        }
                    } catch (e) {
                        alert(e.message);
                        this.$message.error('系统异常，请联系管理员');
                    }
                },
                async queryUserOne1(id) {
                    try {
                        let result = await queryUserOne({id:id},'GET');
                        if (result.code == "0") {
                            console.log("300",result.data.dept._id);
                            //当前地区id得到，查询自身 fid
                            this.querydeptOne(result.data.dept._id);

                            //this.queryDeptForPage(result.data.dept._id,this.currentPage, this.pagesize);

                        } else {
                            this.$message.error('查询用户失败');
                        }
                    } catch (e) {
                        alert(e.message);
                        this.$message.error('系统异常，请联系管理员');
                    }
                },


                //所有的
                async queryDeptList1() {
                    try {
                        let result = await queryDeptList('GET');
                        if (result.code == "0") {
                            console.log("298",result.data);
                            //进行筛选
                            this.list = result.data;
                            for (let i = 0; i < this.list.length; i++) {
                               if( this.list[i].name == this.deptName){
                                  this.fid=this.list[i]._id;
                                  console.log("304",this.fid);
                                  this.queryDeptForPage(this.fid,this.currentPage, this.pagesize);
                               }
                            }

                        } else {
                            this.$message.error('查询用户失败');
                        }
                    } catch (e) {
                        alert(e.message);
                        this.$message.error('系统异常，请联系管理员');
                    }
                },



            },
            //在渲染成html后调用 获取地区数据
            mounted() {
               this.deptName = storageUtil.read("deptName");
               console.log(this.deptName,"298");
                //this.queryDeptList1();

               this.userInfo1(storageUtil.read('sessionId'));
                //this.queryDeptForPage(this.fid, this.currentPage, this.pagesize);
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
