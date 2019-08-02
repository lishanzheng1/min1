<template>
    <section>
        <el-main style="padding-top: 5px">
            <el-col :span="24">
                <el-col :span="21" class="toolbar">
                    <el-breadcrumb separator-class="el-icon-arrow-right">
                        <el-breadcrumb-item>基础服务</el-breadcrumb-item>
                        <el-breadcrumb-item>角色权限管理</el-breadcrumb-item>
                    </el-breadcrumb>
                </el-col>
            </el-col>
            <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
                <el-form inline>
                    <el-form-item label="角色名称">
                        <el-input placeholder="请输入角色关键字" v-model.trim="queryData.queryName" @keyup.enter.native="query" clearable></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="query">搜索</el-button>
                    </el-form-item>
                    <!--<el-form-item>-->
                    <!--<el-button type="primary" @click="handleAdd">创建角色</el-button>-->
                    <!--</el-form-item>-->
                </el-form>
            </el-col>
            <el-table :data="tableData" highlight-current-row v-loading="listLoading">
                <el-table-column fixed label="序号" width="50" align="center">
                    <template slot-scope="scope">
                        <span>{{scope.$index + 1 + (queryData.page - 1) * queryData.pageSize}}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="name" label="角色名称"></el-table-column>
                <!--<el-table-column prop="createtime" label="创建时间"></el-table-column>-->
                <el-table-column fixed="right" label="操作" width="220">
                    <template slot-scope="scope">
                        <!--<el-button type="info" class="el-icon-edit" @click="handleUpt(scope.row)"></el-button>-->
                        <!--<el-button type="danger" class="el-icon-delete" @click="handleDel(scope.row)"></el-button>-->
                        <el-button type="primary" class="el-icon-setting" @click="handleSetMenu(scope.row)" title="设置权限"></el-button>
                    </template>
                </el-table-column>
            </el-table>

            <pages
                    :total='total'
                    :currentPage='currentPage'
                    :pageSize='pagesize'
                    @handleCurrentChangeSub="handleCurrentChange"
            ></pages>
        </el-main>

        <el-dialog :title="title" :visible.sync="dialogVisible" :close-on-click-modal="false">
            <el-form label-width="80px" :rules="rules" :model="formData" ref="formData">
                <el-input auto-complete="off" v-model="formData.id" style="display: none"></el-input>
                <el-form-item label="角色名称" prop="name">
                    <el-input auto-complete="off" v-model.trim="formData.name"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible = false">取消</el-button>
                <el-button type="primary" @click="formSubmit" :loading="submitLoading">提交</el-button>
            </div>
        </el-dialog>

        <el-dialog title="设置权限" :visible.sync="dialogSetMenuVisible" :close-on-click-modal="false">
            <el-tree
                    :data="menuDatas"
                    show-checkbox
                    default-expand-all
                    node-key="_id"
                    ref="menu_tree"
                    highlight-current
                    :props="defaultProps">
            </el-tree>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogSetMenuVisible = false">取消</el-button>
                <el-button type="primary" @click="setMenuSubmit" :loading="submitLoading">提交</el-button>
            </div>
        </el-dialog>
    </section>

</template>

<script>
    import {
        queryRoleForPage,
        queryRoleOne,
        roleInsert,
        roleUpdate,
        roleDelete,
        queryMenuForList
        //menuTree,
        //updateRoleMenuRelation,
        //queryMenuIdArrByRoleId
    } from '../api'

    export default {
        data () {
            return {
                pagesize: 6,
                currentPage: 1,
                total: 30,
                title: '',   //弹出框标题
                dialogVisible: false,  //弹出框是否显示
                dialogSetMenuVisible: false,
                submitLoading: false,  //提交等待是否显示
                listLoading: false,  //数据加载等待是否显示
                tableData:  null,  //表格数据
                queryData: {
                    queryName: '',  //模糊搜索内容
                    page: 1,   //表格当前页
                    pageSize: 9,   //表格每页记录数
                },
                formData : {  //表单数据
                    id: 0,
                    name: ''
                },
                rules: {  //数据校验规则
                    name: [
                        { required: true, message: '请输入角色名称', trigger: 'blur' }
                    ]
                },
                handleRoleId: 0,
                menuDatas: '',
                defaultProps: {
                    children: 'children',
                    label: 'label'
                }
            };
        },
        methods: {
            handleCurrentChange (val) {
                this.page = val;
                this.loadTableData();
            },
            async loadTableData () {
                this.listLoading = true;
                try{
                    const result = await queryRoleForPage(this.queryData, "GET");
                    if(result.code == "0"){
                        this.tableData = result.data.list;
                        this.total = result.data.totalNum;
                    } else {
                        this.$message.error('角色列表查询失败，请联系管理员');
                    }
                } catch (e) {
                    this.$message.error('系统异常，请联系管理员');
                }
                this.listLoading = false;
            },
            async loadTree () {
                let result = await queryMenuForList();
                if(result.code == '0'){
                    result = JSON.parse(JSON.stringify(result).replace(/name/g, "label"));
                    if(result.data.length > 0){
                        let map = {};
                        let resultArr = [];
                        result.data.forEach((item, index) => {
                            item.children = [];
                            map[item._id] = item;
                        });
                        result.data.forEach((item, index) => {
                            if (item.fid == '0') {
                                resultArr.push(item);
                            } else {
                                let parent = map[item.fid];
                                parent.children.push(item);
                            }
                        });
                        this.menuDatas = resultArr;
                    }
                }
            },
            query () {
                this.queryData.page = 1;
                this.loadTableData();
            },
            handleAdd () {
                this.title = "新增";
                this.dialogVisible = true;
                this.clearFormData();
            },
            async handleUpt (row) {
                this.title = "编辑";
                this.dialogVisible = true;

                try {
                    const result = await queryRoleOne({id: row._id}, "GET");
                    console.log(result)
                    if(result.code == "0"){
                        this.formData = {
                            id: result.data._id,
                            name: result.data.name
                        };
                    } else {
                        this.$message.error('获取角色信息失败，请联系管理员');
                    }
                } catch (e) {
                    alert(e.message);
                    this.$message.error('系统异常，请联系管理员');
                }
            },
            clearFormData () {
                this.formData = {
                    id: 0,
                    name: ''
                }
            },
            async formSubmit () {
                let bool = false;

                this.$refs.formData.validate((valid) => {
                    bool = valid;
                });

                if(!bool){
                    return;
                }
                this.submitLoading = true;
                if(this.formData.id == 0){
                    try {
                        const result = await roleInsert(this.formData, "POST");
                        if(result.code == "0"){
                            this.$message({message: '恭喜你，角色信息添加成功', type: 'success'});
                            this.dialogVisible = false;
                            this.clearFormData();
                            this.loadTableData();
                        } else {
                            this.$message.error('角色信息添加失败，请联系管理员');
                        }
                    } catch (e) {
                        alert(e.message);
                        this.$message.error('系统异常，请联系管理员');
                    }
                    this.submitLoading = false;
                } else {
                    try {
                        const result = await roleUpdate(this.formData, "POST");
                        if(result.code == "0"){
                            this.$message({message: '恭喜你，角色信息修改成功', type: 'success'});
                            this.dialogVisible = false;
                            this.clearFormData();
                            this.loadTableData();
                        } else {
                            this.$message.error('角色信息修改失败，请联系管理员');
                        }
                    } catch (e) {
                        alert(e.message);
                        this.$message.error('角色信息添加失败，请联系管理员');
                    }
                }
            },
            handleDel (row) {
                this.$confirm('确认删除该记录吗?', '提示', {
                    type: 'warning'
                }).then(() => {
                    this.deleteOne(row._id);
                }).catch(() => { });
            },
            async deleteOne (id) {
                try {
                    const result = await roleDelete({id}, "GET");
                    if(result.code == "0"){
                        if(result.data.status == '-1'){
                            this.$message.error('角色有对应的用户，角色不能删除');
                        } else {
                            this.$message({message: '恭喜你，角色信息删除成功', type: 'success'});
                            this.loadTableData();
                        }
                    } else {
                        this.$message.error('角色信息删除失败，请联系管理员');
                    }
                } catch (e) {
                    alert(e.message);
                    this.$message.error('系统异常，请联系管理员');
                }
            },
            async handleSetMenu (row) {
                //通过当前选择位置 获得到他所在的_id
                this.handleRoleId = row._id;
                //弹出设置复选框
                this.dialogSetMenuVisible = true;
                //修改某一个值时候 通过id单查询出
                try {
                    const result = await queryRoleOne({id: row._id}, "GET");
                    if(result.code == "0"){
                        let idArr = [];
                        //判断返回值有没有
                        if(result.data.roleMenu == null || result.data.roleMenu == undefined){
                            this.$refs.menu_tree.setCheckedKeys(idArr);
                            return;
                        }
                        //解析为json对象
                        let arr = JSON.parse(result.data.roleMenu);
                        if(arr.length > 0){
                            for(let i = 0; i < arr.length; i++){
                                if(arr[i].type == 'Checked' ){
                                    idArr.push(arr[i].id);
                                }
                            }
                        }
                        //设置勾选的节点
                        this.$refs.menu_tree.setCheckedKeys(idArr);
                    } else {
                        this.$message.error('获取角色信息失败，请联系管理员');
                    }
                } catch (e) {
                    alert(e.message);
                    this.$message.error('系统异常，请联系管理员');
                }
            },
            async setMenuSubmit () {
                //得到了选中的节点
                let checkedKeys = this.$refs.menu_tree.getCheckedKeys();
                //得到了半选中的节点
                let halfCheckedKeys = this.$refs.menu_tree.getHalfCheckedKeys();
                //遍历选中的节点
                let arr = [];
                checkedKeys.forEach((item, index) => {
                    arr.push({id: item, type: 'Checked'});
                });
                //遍历选中的节点
                halfCheckedKeys.forEach((item, index) => {
                    arr.push({id: item, type: 'HalfChecked'});
                });

                let param = {
                    id: this.handleRoleId,
                    roleMenu: JSON.stringify(arr)
                };

                try {
                    const result = await roleUpdate(param, "POST");
                    if(result.code == '0'){
                        this.$message({message: '恭喜你，权限设置成功', type: 'success'});
                        this.dialogSetMenuVisible = false;
                        this.loadTableData();
                    } else {
                        this.$message.error('权限设置失败，请联系管理员');
                    }
                } catch (e) {
                    alert(e.message);
                    this.$message.error('系统异常，请联系管理员');
                }
            }
        },
        mounted () {
            this.loadTableData();
            this.loadTree();
        }
    }
</script>

<style type="text/css" scoped>
    .toolbar {
        background: #f2f2f2;
        padding: 10px;
        margin: 10px 0px;
    }
    .el-tree{
        background-color: #fff;
        color:#333;
        padding-top:15px;
    }
    .el-tree-node:focus>.el-tree-node__content{
        background-color:#F5F7FA;
    }
    /*.el-tree-node__content:hover{*/
    /*background-color:#F5F7FA!important;*/
    /*}*/
    .el-header {
        background-color: #fff;
        color: #333;
        line-height: 60px;
        padding: 0px;
        margin: 0px;
    }
    .el-footer {
        background-color: #fff;
        color: #333;
        line-height: 60px;
    }
    .el-aside {
        color: #333;
    }
    .el-form--inline {
        margin-bottom: -10px;
    }
</style>
