<template>
    <section>
        <el-main style="padding-top: 5px">
            <el-col :span="24">
                <el-col :span="21" class="toolbar">
                    <el-breadcrumb separator-class="el-icon-arrow-right">
                        <el-breadcrumb-item>基础服务</el-breadcrumb-item>
                        <el-breadcrumb-item ><a href="#" @click.prevent="go(-1, 0)" style="cursor: hand">字典管理</a></el-breadcrumb-item>
                        <el-breadcrumb-item style="cursor: hand" v-for="(item, index) in init.nameArr"
                                            :key="index"><a href="#" @click.prevent="go(index, item.id)">{{item.name}}</a></el-breadcrumb-item>
                    </el-breadcrumb>
                </el-col>
            </el-col>
            <el-table :data="tableData" highlight-current-row v-loading="listLoading">
                <el-table-column fixed label="序号" width="50" align="center">
                    <template slot-scope="scope">
                        <span>{{scope.$index + 1 + (queryData.page - 1) * queryData.rows}}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="name" label="字典[项]名称"></el-table-column>
                <el-table-column fixed="right" label="操作" width="260">
                    <template slot-scope="scope">
                        <el-button type="primary" icon="el-icon-search" title="查看字典项" @click="handleQuery(scope.row)"></el-button>
                        <el-button type="info" icon="el-icon-edit" title="修改" @click="handleUpt(scope.row)"></el-button>
                        <el-button type="danger" icon="el-icon-delete" title="删除" @click="handleDel(scope.row)"></el-button>
                    </template>
                </el-table-column>
            </el-table>
            <pages :total='total' :currentPage='currentPage' :pageSize='pageSize'
                   @handleCurrentChangeSub="handleCurrentChange">
            </pages>
        </el-main>

        <el-dialog :title="title" :visible.sync="dialogVisible" :close-on-click-modal="false">
            <el-form label-width="80px" :rules="rules" :model="formData" ref="formData">
                <el-input auto-complete="off" v-model="formData.id" style="display: none"></el-input>
                <el-form-item label="字典名称" prop="name">
                    <el-input auto-complete="off" v-model="formData.name"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible = false">取消</el-button>
                <el-button type="primary" @click="formSubmit" :loading="submitLoading">提交</el-button>
            </div>
        </el-dialog>

    </section>

</template>

<script>
    import {
        queryDictForPage,
        queryDictOne,
        dictInsert,
        dictUpdate,
        dictDelete
    } from '../api'

    export default {
        data () {
            return {
                title: '创建字典项',   //弹出框标题
                dialogVisible: false,  //弹出框是否显示
                submitLoading: false,  //提交等待是否显示
                listLoading: false,  //数据加载等待是否显示
                tableData: null,  //表格数据
                parentInfo: null,
                state: false,
                currentPage:1,
                pageSize:5,
                total: 0,
                queryData: {
                    page: 1,
                    rows: 10
                },
                fid: '0',
                init: {
                    nameArr: []
                },

                formData : {
                    id: 0,
                    name: ''
                },
                rules: {
                    name: [
                        { required: true, message: '请输入字典名称', trigger: 'blur' }
                    ]
                }
            };
        },

        methods: {
            handleCurrentChange (val) {
                this.queryData.page = val;
                this.loadTableData();
            },
            async loadTableData () {
                this.listLoading = true;
                try {
                    this.queryData.fid = this.fid;
                    const result = await queryDictForPage(this.queryData, "GET");
                    if(result.code == "0"){
                        this.tableData = result.data.list;
                        this.total = result.data.count;
                    } else {
                        this.$message.error('字典信息加载失败，请联系管理员');
                    }
                    this.listLoading = false;
                } catch (e) {
                    this.$message.error('系统异常，请联系管理员');
                    this.listLoading = false;
                }
            },
            query () {
                this.queryData.page = 1;
                this.loadTableData();
            },
            handleQuery (row) {
                this.init.nameArr.push({'id': row._id, 'name': row.name});
                this.fid = row._id;
                this.loadTableData();
            },
            go (index, id) {
                this.fid = id;
                if(index == -1){
                    this.init.nameArr.length = 0;
                } else {
                    this.init.nameArr.splice(index + 1);
                }
                this.loadTableData();
            },
            handleAdd () {
                this.title = '创建字典[项]';
                this.state = false;
                this.dialogVisible = true;
                this.clearFormData();
            },
            async handleUpt (row) {
                this.title = '编辑字典[项]';
                this.state = true;
                this.dialogVisible = true;

                try {
                    const result = await queryDictOne({id: row._id}, "GET");
                    if(result.code == "0"){
                        this.formData = {
                            id: result.data._id,
                            name: result.data.name,
                            fid: result.data.fid
                        };
                    } else {
                        this.$message.error('获取字典项信息失败，请联系管理员');
                    }
                } catch (e) {
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
                    try{
                        this.formData.fid = this.fid;
                        const result = await dictInsert(this.formData, "POST");
                        if(result.code == "0"){
                            this.$message({message: '恭喜你，字典信息添加成功', type: 'success'});
                            this.dialogVisible = false;
                            this.clearFormData();
                            this.loadTableData();
                        } else {
                            this.$message.error('字典信息添加失败，请联系管理员');
                        }
                    } catch (e) {
                        this.$message.error('系统异常，请联系管理员');
                    }
                    this.submitLoading = false;
                } else {
                    try{
                        const result = await dictUpdate(this.formData, "POST");
                        if(result.code == "0"){
                            this.$message({message: '恭喜你，字典信息修改成功', type: 'success'});
                            this.dialogVisible = false;
                            this.clearFormData();
                            this.loadTableData();
                        } else {
                            this.$message.error('字典信息修改失败，请联系管理员');
                        }
                    } catch (e) {
                        this.$message.error('系统异常，请联系管理员');
                    }
                    this.submitLoading = false;
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
                try{
                    const result = await dictDelete({id}, "GET");
                    if(result.code == '0'){
                        if(result.data.status != '-1') {
                            this.$message({message: '恭喜你，字典信息删除成功', type: 'success'});
                            this.loadTableData();
                        } else {
                            this.$message.error('字典还有对应的字典项无法删除');
                        }
                    } else {
                        this.$message.error('字典信息删除失败，请联系管理员');
                    }
                } catch (e) {
                    this.$message.error('系统异常，请联系管理员');
                }
            }
        },
        mounted () {
            this.fid = '0';
            this.loadTableData();
        }
    }
</script>

<style type="text/css" scoped>
    .toolbar {
        background: #f2f2f2;
        margin: 20px 0;
        position: relative;
        text-align: center;
    }
</style>
