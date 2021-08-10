<template>
  <!-- 创建问卷 -->
  <div v-loading.fullscreen.lock="loading" class="create">
    <el-alert class="mb-20" type="error">编辑问卷会清空已有的统计数据，请确保问卷在未发布的情况下进行修改。</el-alert>
    <el-form
      ref="form"
      :model="form"
      :rules="rules"
      label-position="right"
      label-width="100px"
    >
      <el-form-item label="问卷名称" prop="title">
        <el-input v-model="form.title" />
      </el-form-item>
      <el-form-item label="问卷介绍" prop="intro">
        <el-input v-model="form.intro" type="textarea" rows="5" />
      </el-form-item>

      <div class="add-option">
        <el-button type="primary" @click="addOption(questionType.SINGLE_CHOICE)">单选题</el-button>
        <el-button type="primary" @click="addOption(questionType.MULTIPLE_CHOICE)">多选题</el-button>
        <el-button type="primary" @click="addOption(questionType.TEXT_QUESTION)">文本题</el-button>
      </div>

      <question-list
        :question-list="form.topic"
        @delQuestion="onDelQuestion"
        @addOption="onAddOption"
        @delOption="onDelOption"
      />

      <el-form-item label="截止时间" prop="deadline">
        <el-date-picker
          v-model="form.deadline"
          type="datetime"
          :picker-options="datePickerOptions"
          placeholder="选择日期时间"
        />
      </el-form-item>

      <el-form-item>
        <el-button type="default" @click="submitNaire(NaireStatus.UNPUBLISHED)">保存问卷</el-button>
        <el-button type="success" @click="submitNaire(NaireStatus.PUBLISHED)">发布问卷</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script lang="ts">
// import { Component, Vue } from 'vue-property-decorator'
// import dayjs from 'dayjs'
// import { Form as ElForm } from 'element-ui'

// import * as NaireAction from '@/api/naire'

// import { questionType, questionTypeText } from '@/config/enum/questionType'
// import { NaireStatus } from '@/config/enum/naireStatus'

// import QuestionList from '@/components/Question/QuestionList.vue'

// @Component({
//   components: {
//     QuestionList
//   }
// })
// export default class NavBar extends Vue {
//   private questionType = questionType
//   private NaireStatus = NaireStatus
//   private form:Questionnaire.INaire = {
//     ST_TITLE: '',
//     ST_DESC: '',
//     ST_CITEM_ID: '',
//     ST_CITEM_CODE: '',
//     ST_CITEM_NAME: '',
//     ztId: '',
//     title: '',
//     intro: '',
//     deadline: '',
//     status: 0,
//     options: '',
//     topic: []
//   }
//   private loading: boolean = false
//   private rules = {
//     title: [
//       { required: true, message: '请输入问卷标题', trigger: 'blur' }
//     ],
//     deadline: [
//       { required: true, message: '请选择截止时间', trigger: 'blur' }
//     ]
//   }

//   private datePickerOptions = {
//     disabledDate (time: Date) {
//       return time.getTime() < dayjs().add(-1, 'day').valueOf()
//     }
//   }

//   private onAddOption ({ index }: { index: number }) {
//     const tempData = {
//       content: '选项',
//       isAddition: false,
//       image: '', // 选项图片
//       desc: ''
//     }
//     // this.form.topic[index].options!.push({ ...tempData })
//   }

//   private onDelOption ({ index, opIndex }: { index: number, opIndex: number }) {
//     if (this.form.topic[index].options!.length < 2) {
//       return this.$message.warning('已经是最后一个选项，无法删除。')
//     }
//     this.form.topic[index].options!.splice(opIndex, 1)
//   }

//   private onDelQuestion ({ index, type }: { index: number, type: number }) {
//     if (type === 1) {
//       this.form.topic.splice(index, 1)
//     } else if (type === 2) {
//       if (index === 0) {
//         return
//       }
//       this.swapItems(this.form.topic, index, index - 1)
//     } else if (type === 3) {
//       if (index === this.form.topic.length - 1) {
//         return
//       }
//       this.swapItems(this.form.topic, index, index + 1)
//     }
//   }

//   swapItems (arr: any[], index1: number, index2: number) {
//     arr[index1] = arr.splice(index2, 1, arr[index1])[0]
//     return arr
//   }

//   addOption (type: questionTypeText) {
//     switch (type) {
//       case questionType.SINGLE_CHOICE:
//         const radioQues = {
//           ST_QUESTION_CONTENT: '单选问题',
//           ST_QUESTIONS_ID: '',
//           options: [
//             {
//               content: '答案',
//               isAddition: false,
//               image: '',
//               desc: '',
//               ST_ANSWER_ID: '',
//               ST_ANSWER_TYPE: '',
//               ST_KEY: '',
//               ST_VALUE: '',
//               ST_ANSWER: '答案',
//               ST_TIP: '',
//               NM_ORDER: '',
//               NM_IS_OVER: '',
//               ST_DESC: ''
//             }
//           ],
//           description: '',
//           type: '单选',
//           isRequired: true,
//           selectContent: '',
//           setting: {
//             last: 1
//           },
//           additional: ''
//         }
//         this.form.topic.push(radioQues)
//         break
//       case questionType.MULTIPLE_CHOICE:
//         const checkboxQues = {
//           ST_QUESTION_CONTENT: '多选问题',
//           ST_QUESTIONS_ID: '',
//           options: [
//             {
//               content: '选项',
//               isAddition: false,
//               image: '',
//               desc: '',
//               ST_ANSWER_ID: '',
//               ST_ANSWER_TYPE: '',
//               ST_KEY: '',
//               ST_VALUE: '',
//               ST_ANSWER: '答案',
//               ST_TIP: '',
//               NM_ORDER: '',
//               NM_IS_OVER: '',
//               ST_DESC: ''
//             }
//           ],
//           description: '',
//           type: '多选',
//           isRequired: true,
//           setting: {
//             last: 1 // 最少选择几项
//           },
//           selectMultipleContent: []
//         }
//         this.form.topic.push(checkboxQues)
//         break
//       case questionType.TEXT_QUESTION:
//         const textareaQues = {
//           ST_QUESTION_CONTENT: '单选问题',
//           ST_QUESTIONS_ID: '',
//           description: '',
//           type: '文本',
//           isRequired: true,
//           setting: {},
//           selectContent: ''
//         }
//         this.form.topic.push(textareaQues)
//         break
//     }
//   }

//   submitNaire (type: NaireStatus) {
//     console.log(this.form.topic)
//     const form = this.$refs.form as ElForm
//     form.validate(async (valid) => {
//       if (!valid) return
//       if (this.form.topic.length === 0) {
//         return this.$message.warning('请至少添加一道题目。')
//       }
//       this.$message.warning('保存完成')
//       // const params = {
//       //   naire: {
//       //     ...this.form,
//       //     deadline: new Date(this.form.deadline).getTime()
//       //   },
//       //   status: 'create'
//       // }
//       // const res = await NaireAction.create(params)
//       // if (res.success) {
//       //   this.$message.success('新建问卷成功！')
//       //   await this.$router.push('/list')
//       // } else {
//       //   this.$message.error(res.msg)
//       // }
//     })
//   }

//   async fetchData () {
//     this.loading = true
//     const res = await NaireAction.detail({
//       itemId: this.$route.params.itemId,
//       citemId: this.$route.params.citemId,
//       type: 'normal'
//     })
//     this.loading = false
//     if (res.success) {
//       this.form = {
//         ST_TITLE: res.data.ST_TITLE,
//         ST_DESC: res.data.ST_DESC,
//         ST_CITEM_ID: res.data.ST_CITEM_ID,
//         ST_CITEM_CODE: res.data.ST_CITEM_CODE,
//         ST_CITEM_NAME: res.data.ST_CITEM_NAME,
//         ztId: this.$route.params.citemId,
//         title: '',
//         intro: '',
//         deadline: '',
//         status: 0,
//         options: '',
//         topic: res.data.data
//       }
//       console.log(this.form)
//     }
//   }
//   mounted () {
//     const itemId = this.$route.params.itemId
//     if (itemId !== 'add') {
//       this.fetchData()
//     }
//   }
// }
</script>

<style lang="scss" scoped>
  .create {
    .add-option {
      margin-bottom: 20px;
      text-align: center;
    }
  }
</style>
