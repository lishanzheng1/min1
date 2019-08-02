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
                <el-form-item label="地区" :label-width="formLabelWidth">
                    <el-cascader :options="options" :props="defaultProps" v-model="form.address"
                                  clearable></el-cascader>
                </el-form-item>
                <el-form-item label="角色" :label-width="formLabelWidth">
                    <el-select v-model="form.role" placeholder="请选择角色">
                        <el-option
                                v-for="aa in roles"
                                :label="aa.name"
                                :value="aa._id">
                        </el-option>
                    </el-select>
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
    import {queryUserForPage,
        queryRoleForPage,
        userDelete,
        setPassword,
        userInsert,
        queryDeptList} from '../api'

    export default {
        data() {
            return {
                value:"",
                input: '',
                emitPath:false,
                dialogFormVisible: false,
                formLabelWidth: '120px',
                form: {
                    loginName: '',
                    loginPwd: '',
                    address: '',
                    role:'',
                },
                defaultProps: {
                    label: 'name',
                    value: '_id',
                    emitPath : false
                },
                index: '',
                update: false,
                list: [],
                tList:[],
                pagesize: 6,
                currentPage: 1,
                total: 30,
                options :[],
                roles :[]
            }
        },
        methods: {
            //回显
            adduser(){
                this.form = {};
                this.queryDeptList();
                this.queryRoleForPage1();
                this.dialogFormVisible = true;
            },
            //弹出对话框之后点击确定后添加数据
            add(){
                console.log( "113",this.form.address);
                this.userInsert1(this.form.loginName,this.form.loginName,this.form.address,this.form.role);

                this.dialogFormVisible = false;
            },
            //查找
            selectuser() {
                this.queryUserForPage(this.input);
            },
            //重置密码
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
            //用户添加
            async userInsert1(loginName,loginPwd,dept,role) {
                try {
                    let result = await userInsert(
                        {loginName: loginName,loginPwd:loginPwd,dept:dept,role:role},
                        "POST");
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
            async queryUserForPage1(queryName) {
                try {
                    let result = await queryUserForPage({
                        queryName: queryName,
                        page: this.currentPage,
                        rows: this.pagesize
                    }, "GET");
                    console.log("200",result);
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
            //事件 分页显示数据
            handleCurrentChange: function (currentPage) {
                //点击第几页
                this.currentPage = currentPage;
                this.queryUserForPage(this.input);
            },
            //查询所有地区的集合 分级别
            async queryDeptList1() {
                try {
                    let result = await queryDeptList( "GET");
                    if (result.code == 0) {
                        let tlist = [];
                        //三级联动
                        for (let j = 0; j < result.data.length; j++) {
                            let item = result.data[j];
                            if (!item.fid || item.fid == '0') {
                                tlist.push(item);
                            } else {
                                for (let k = 0; k < result.data.length; k++) {
                                    let tItem = result.data[k];
                                    if (tItem._id == item.fid) {
                                        if (tItem.children) {
                                            tItem.children.push(item);
                                        } else {
                                            tItem.children = [];
                                            tItem.children.push(item);
                                        }
                                    }
                                }
                            }
                        }
                        this.options = tlist;
                    }
                    else {
                        this.$message.error('获取列表失败');
                    }
                } catch (e) {
                    alert(e.message);
                    this.$message.error('系统异常，请联系管理员');
                }
            },
            //查询所有的权限分配
            async queryRoleForPage1() {
                try {
                    let result = await queryRoleForPage( 'GET');
                    if (result.code == "0") {
                        this.roles = result.data;
                        console.log("256",this.roles);
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
            this.queryUserForPage1(this.input);
            //this.queryRoleForPage1();
            //his.queryDeptForPage1();
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
