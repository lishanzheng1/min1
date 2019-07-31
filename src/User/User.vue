<template>
    <div class="el-main">
        <el-row>
            <el-breadcrumb separator-class="el-icon-arrow-right">
                <el-breadcrumb-item :to="{ path: '/hello' }">基础服务</el-breadcrumb-item>
                <el-breadcrumb-item >用户管理</el-breadcrumb-item>
            </el-breadcrumb>
        </el-row>
        <el-row style="margin: 20px 0 0 0 ; float: left">
            <em>用户名</em>
            <el-input placeholder="用户名称" v-model="input" clearable style="width: 200px!important">用户名</el-input>
            <el-button type="primary" size="medium" @click="selectuser">查询</el-button>
        </el-row>
        <el-table :data="list">
            <el-table-column prop="loginName" label="登录名" sortable>
            </el-table-column>
            <el-table-column prop="loginPwd" label="登录密码" sortable>
            </el-table-column>
            <el-table-column prop="dept.name" label="地区" sortable>
            </el-table-column>
            <el-table-column prop="role.name" sortable label="角色">
            </el-table-column>
            <el-table-column label="操作">
                <template slot-scope="scope">
                    <el-button  type="info" title="重置密码" icon="el-icon-setting"
                                @click="handleEdit(scope.$index, scope.row)"></el-button>
                    <el-button  icon="el-icon-delete" title="删除信息" type="danger"
                                @click="handleDelete(scope.$index, scope.row)"></el-button>
                </template>
            </el-table-column>
        </el-table>
        <el-button style="float: left" type="primary" size="medium" @click="adduser">新增</el-button>
        <el-dialog title="新添加人物" :visible.sync="dialogFormVisible">
            <el-form :model="form">
                <el-form-item label="登录名" :label-width="formLabelWidth">
                    <el-input v-model="form.loginName" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="登录密码" :label-width="formLabelWidth">
                    <el-input v-model="form.loginPwd" autocomplete="off"></el-input>
                </el-form-item>
                 <el-form-item >
                    <!-- <el-select v-model="value" placeholder="请选择">
                         <el-option
                                 v-for="item in options"
                                 :key="item.value"
                                 :label="item.label"
                                 :value="item.value">
                         </el-option>
                     </el-select>-->
               <!-- <el-dropdown size="mini" split-button type="primary">
                    地区
                    <el-dropdown-menu slot="dropdown">
                        <el-dropdown-item>黄金糕</el-dropdown-item>
                        <el-dropdown-item>狮子头</el-dropdown-item>
                        <el-dropdown-item>螺蛳粉</el-dropdown-item>
                        <el-dropdown-item>双皮奶</el-dropdown-item>
                        <el-dropdown-item>蚵仔煎</el-dropdown-item>
                    </el-dropdown-menu>
                </el-dropdown>-->
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogFormVisible = false">取 消</el-button>
                <el-button type="primary" @click="add">确 定</el-button>
            </div>
        </el-dialog>
        <pages
                :total='total'
                :currentPage='currentPage'
                :pageSize='pagesize'
                @handleCurrentChangeSub="handleCurrentChange"
        ></pages>
    </div>
</template>
<script>
    import ElRow from "element-ui/packages/row/src/row";
    import ElButton from "../../node_modules/element-ui/packages/button/src/button.vue";
    import ElCol from "element-ui/packages/col/src/col";
    import {queryUserForPage} from '../api'
    import {userDelete} from '../api'
    import {setPassword} from '../api'
    import {userInsert} from '../api'
    export default {
        components: {
            ElCol,
            ElButton,
            ElRow
        },
        data() {
            return {
                value:"",
                input: '',
                dialogFormVisible: false,
                formLabelWidth: '120px',
                form: {
                    loginName: '',
                    loginPwd: '',
                    address: '',
                    role: '',
                },
                index: '',

                update: false,
                list: [],
                pagesize: 6,
                currentPage: 1,
                total: 30
            }
        },
        methods: {
            adduser(){
                this.form = {};
                this.dialogFormVisible = true;
            },
            add(){








                this.userInsert1(this.form.loginName,this.form.loginName);
                this.dialogFormVisible = false;
            },
            selectuser() {
                this.queryUserForPage(this.input);
            },
            async setPassword(id) {
                try {
                    let result = await setPassword({id: id}, "GET");
                    if (result.code == 0) {
                        this.$message.success('重置密码成功成功');
                    }
                    else {
                        this.$message.error('删除失败');
                    }
                } catch (e) {
                    alert(e.message);
                    this.$message.error('系统异常，请联系管理员');
                }
            },
            async userInsert1(loginName,loginPwd) {
                try {
                    let result = await userInsert({loginName: loginName,loginPwd:loginPwd}, "POST");
                    if (result.code == 0) {
                       console.log("000000000",result.data);
                       this.queryUserForPage(this.input);
                        this.$message.success('添加用户成功');
                    }
                    else {
                        this.$message.error('删除失败');
                    }
                } catch (e) {
                    alert(e.message);
                    this.$message.error('系统异常，请联系管理员');
                }
            },
            async delData(id) {
                try {
                    let result = await userDelete({id: id}, "GET");
                    if (result.code == 0) {
                        this.$message.success('删除成功');
                        this.queryUserForPage(this.input);
                    }
                    else {
                        this.$message.error('删除失败');
                    }
                } catch (e) {
                    alert(e.message);
                    this.$message.error('系统异常，请联系管理员');
                }
            },
            //删除
            handleDelete(index, row) {
                this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.delData(row._id);
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消删除'
                    });
                });
            },
            //重置密码
            handleEdit(index, row) {
                this.setPassword(row._id);
            },
            //用户查询
            async queryUserForPage(queryName) {
                try {
                    let result = await queryUserForPage({
                        queryName: queryName,
                        page: this.currentPage,
                        rows: this.pagesize
                    }, "GET");
                    if (result.code == 0) {
                        this.list = result.data.list;
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
            filterHandle(value, row) {
                return this.input === row.name;
            },
            handleSizeChange: function (size) {
                //每页下拉显示数据
                this.pagesize = size;
            },
            //事件 分页显示数据
            handleCurrentChange: function (currentPage) {
                //点击第几页
                this.currentPage = currentPage;
                this.queryUserForPage(this.input);
            },
            //首页
            userfrist() {
                this.currentPage = 1;
            },
            //尾页
            userlast() {
                this.currentPage = (this.total / this.pagesize);
            },
        },
        mounted() {
            this.queryUserForPage(this.input);
        },
    }
</script>
<style>
    .el-main button {
        margin-left: 20px !important;
    }

    em {
        font-style: normal;
        margin-right: 10px;
    }
</style>
