<template>
  <!-- 创建问卷 -->
  <div id="chatContainer" class="create">
    <el-form ref="form" :model="form" :rules="rules" label-position="right" label-width="100px">
      <el-form-item label="问卷名称" prop="ST_TITLE">
        <el-input v-model="form.ST_TITLE" />
      </el-form-item>
      <el-form-item label="跳转地址" prop="jumpUrl">
        <el-input v-model="form.jumpUrl" />
      </el-form-item>
      <el-form-item label="问卷介绍" prop="intro">
        <el-input v-model="form.ST_DESC" type="textarea" rows="5" />
      </el-form-item>

      <question-list
        :question-list="form.topic"
        @delQuestion="onDelQuestion"
        @addOption="onAddOption"
        @addJump="onAddJump"
        @updTools="onUpdTools"
        @delOption="onDelOption"
        @datadragEnd="onDatadragEnd"
      />

      <div class="add-option">
        <el-button v-loading.fullscreen.lock="loading" type="primary" @click="addOption(questionType.SINGLE_CHOICE)">添加单选题</el-button>
        <el-button v-loading.fullscreen.lock="loading" type="primary" @click="addOption(questionType.MULTIPLE_CHOICE)">添加多选题</el-button>
        <el-button v-loading.fullscreen.lock="loading" type="primary" @click="addOption(questionType.TEXT_QUESTION)">添加文本题</el-button>
      </div>
      <br><br>
      <!-- <el-form-item label="截止时间" prop="deadline">
        <el-date-picker
          v-model="form.deadline"
          type="datetime"
          :picker-options="datePickerOptions"
          placeholder="选择日期时间"
        />
      </el-form-item> -->
      <div style="text-align: center;">
        <el-button size="medium" type="info" style="width:30%;" @click="backup()">返回</el-button>
        <el-button v-loading.fullscreen.lock="loading" size="medium" type="success" style="width:30%;" @click="submitNaire()">保存问卷</el-button>
      </div>
      <!-- <el-button type="success" @click="submitNaire(NaireStatus.PUBLISHED)">发布问卷</el-button> -->

    </el-form>
    <el-drawer
      ref="drawer"
      title="拓展信息"
      :visible.sync="updTools"
      direction="rtl"
      custom-class="demo-drawer"
    >
      <div class="demo-drawer__content" style="margin:20px;">
        <h3>问题：{{ this.aform.ST_QUESTION_CONTENT }}</h3>
        <hr>
        <h3>答案：{{ this.aform.ST_ANSWER }}</h3>
        <hr>
        <br>
        <el-form ref="form" :model="aform" label-width="100px">
          <el-form-item label="提示信息">
            <el-input v-model="aform.ST_TIP"></el-input>
          </el-form-item>
          <el-form-item label="关联Key">
            <el-input v-model="aform.ST_KEY"></el-input>
          </el-form-item>
          <el-form-item label="关联Value">
            <el-input v-model="aform.ST_VALUE"></el-input>
          </el-form-item>
          <!-- <el-form-item label="关联材料">
            <el-select v-model="aform.ST_STUFF_ID" placeholder="请选择相关材料" style="width:100%;">
              <el-option label="区域一" value="shanghai"></el-option>
              <el-option label="区域二" value="beijing"></el-option>
            </el-select>
          </el-form-item> -->
          <el-form-item label="关联情形" v-if="this.form.ztId != this.form.ST_CITEM_ID">
            <el-checkbox-group v-model="aform.ST_STATUS_ID">
              <el-checkbox
                v-for="item in aform.ST_STATUS_ID_LIST"
                :key="item.ST_STATUS_ID"
                :label="item.ST_STATUS_ID"
                >{{item.ST_STATUS_NAME}}</el-checkbox>
            </el-checkbox-group>
          </el-form-item>
          <el-form-item label="追加填空" v-if="aform.ST_ANSWER_TYPE === 'input' ? false : true">
            <el-switch active-color="#13ce66" v-model="aform.isAddGap" active-text="是" inactive-text="否"></el-switch>
          </el-form-item>
          <el-form-item label="单事项终止"  v-if="this.form.ztId != this.form.ST_CITEM_ID">
            <el-switch active-color="#ff4949" v-model="aform.NM_IS_OVER" active-text="是" inactive-text="否"></el-switch>
          </el-form-item>
          <el-form-item label="全部终止">
            <el-switch active-color="#ff4949" v-model="aform.NM_IS_ALL_OVER" active-text="是" inactive-text="否"></el-switch>
          </el-form-item>
          <el-form-item label="跳转url">
            <el-input v-model="aform.ST_JUMP_URL"></el-input>
          </el-form-item>
          <el-form-item label="跳转方式">
            <el-select v-model="aform.ST_JUMP_TYPE" placeholder="请选择跳转方式" style="width:100%;">
              <el-option label="下一步跳转" value="下一步跳转"></el-option>
              <el-option label="提示跳转" value="提示跳转"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button v-loading.fullscreen.lock="loading" type="success" style="width:100%;" @click="submitAnswers()">保 存</el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-drawer>
    <!--跳转逻辑-->
    <el-dialog title="跳转逻辑" width="80%" :visible.sync="jumpTools">
      <el-form>
        <div
          v-for="(option, opIndex) in jumpList"
          :key="opIndex">
          <el-row :gutter="22">
            <el-col :span="7">
              <el-form-item label="选择答案" label-width="100px">
                <el-select v-if="option.xtype === '多选' ? true : false" multiple v-model="option.aId" placeholder="答案" style="width:100%;" @visible-change="answerChange($event,option.aId)">
                  <el-option v-for="(an, anIndex) in option.aList" :key="anIndex" :label="an.ST_ANSWER" :value="an.ST_ANSWER_ID">{{ an.ST_ANSWER }}</el-option>
                </el-select>
                <el-select v-else v-model="option.aId" placeholder="答案" style="width:100%;" @visible-change="answerChange($event,option.aId)">
                  <el-option v-for="(an, anIndex) in option.aList" :key="anIndex" :label="an.ST_ANSWER" :value="an.ST_ANSWER_ID" :disabled="an.isAddition" >{{ an.ST_ANSWER }}</el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="9">
              <el-form-item label="则跳转到" label-width="100px">
                  <el-cascader
                    style="width:100%;"
                    v-model="option.qList.value"
                    :options="option.qList.options"
                    :props="{ expandTrigger: 'hover' }"></el-cascader>
              </el-form-item>
            </el-col>
            <el-col :span="4">
              <el-button
                type="success"
                icon="el-icon-plus"
                size="mini"
                @click="addJumpItem()"
              />
              <el-button
                type="danger"
                icon="el-icon-delete"
                size="mini"
                @click="delJumpItem(opIndex, option.aId)"
              />
            </el-col>
          </el-row>
        </div>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="jumpTools = false">取 消</el-button>
        <el-button type="success" @click="saveJumpList()">保 存</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import dayjs from 'dayjs'
import { Form as ElForm } from 'element-ui'

import * as NaireAction from '@/api/naire'

import { questionType, questionTypeText } from '@/config/enum/questionType'
import { NaireStatus } from '@/config/enum/naireStatus'

import QuestionList from '@/components/Question/QuestionList.vue'

@Component({
  components: {
    QuestionList
  }
})
export default class NavBar extends Vue {
  private questionType = questionType
  private NaireStatus = NaireStatus
  private form:Questionnaire.INaire = {
    ST_TITLE: '',
    ST_DESC: '',
    ST_CITEM_ID: '',
    ST_CITEM_CODE: '',
    ST_CITEM_NAME: '',
    jumpUrl: '',
    ztId: '',
    title: '',
    intro: '',
    deadline: '',
    status: 0,
    options: '',
    topic: []
  }
  private aform:Questionnaire.IOptionItem = {
    ST_QUESTION_CONTENT: '',
    o_id: '',
    content: '',
    desc: '',
    image: '',
    isAddition: false,
    isAddGap: false,
    ST_ANSWER_ID: '',
    ST_ANSWER_TYPE: '',
    ST_KEY: '',
    ST_VALUE: '',
    ST_ANSWER: '',
    ST_TIP: '',
    NM_ORDER: '',
    NM_IS_OVER: '',
    NM_IS_ALL_OVER: '',
    ST_DESC: '',
    ST_JUMP_URL: '',
    ST_JUMP_TYPE: '',
    ST_STUFF_ID: '',
    ST_STATUS_ID: [],
    ST_STUFF_ID_LIST: [],
    ST_STATUS_ID_LIST: []
  }
  private jumpList: any[] = []
  private cItemQLA: any = {}
  private loading: boolean = false
  private updTools: boolean = false
  private jumpTools: boolean = false
  private isorder: boolean = false
  private qorder: number = 1
  private aorder: number = 1
  private rules = {
    title: [
      { required: true, message: '请输入问卷标题', trigger: 'blur' }
    ],
    deadline: [
      { required: true, message: '请选择截止时间', trigger: 'blur' }
    ]
  }

  private datePickerOptions = {
    disabledDate (time: Date) {
      return time.getTime() < dayjs().add(-1, 'day').valueOf()
    }
  }

  private onDatadragEnd ({ oldIndex, newIndex }: { oldIndex: number, newIndex: number }) { // 上下拖动调整位置
    this.isorder = true
    this.form.topic.forEach((qitem: Questionnaire.IQuestionItem, index: number) => {
      if (oldIndex == qitem.qorder) {// eslint-disable-line
        qitem.qorder = newIndex
      } else {
        if (newIndex > oldIndex) {
          if (qitem.qorder >= oldIndex && qitem.qorder <= newIndex) {
            qitem.qorder = (qitem.qorder - 1)
          }
        } else {
          if (qitem.qorder >= newIndex && qitem.qorder <= oldIndex) {
            qitem.qorder = Number(qitem.qorder) + 1
          }
        }
      }
    })
  }

  async onAddOption ({ index, opIndex }: { index: number, opIndex: number }) {
    let tempData = {
      content: '选项',
      isAddition: false,
      isAddGap: false,
      image: '', // 选项图片
      desc: '',
      ST_ANSWER_ID: '',
      ST_ANSWER_TYPE: '',
      ST_KEY: '',
      ST_VALUE: '',
      ST_ANSWER: '答案',
      ST_TIP: '',
      NM_ORDER: '',
      NM_IS_OVER: 'false',
      NM_IS_ALL_OVER: 'false',
      ST_DESC: '',
      ST_JUMP_URL: '',
      ST_JUMP_TYPE: '',
      ST_STUFF_ID: '',
      ST_STATUS_ID: []
    }
    const params = {
      naire: {
        ...tempData,
        asize: this.form.topic[index].options!.length + 1,
        ST_QUESTIONS_ID: this.form.topic[index].ST_QUESTIONS_ID
      },
      status: 'create'
    }
    const res = await NaireAction.updateA(params)
    if (res.success) {
      tempData = res.data.naire
      // this.form.topic[index].options!.push({ ...tempData })
      this.form.topic[index].options!.splice(opIndex + 1, 0, tempData)
      this.loading = false
    } else {
      this.$message.success('加载失败，请稍后重试')
    }
  }

  async onAddJump (index : number) { // 跳转逻辑选择
    this.jumpList = []
    this.jumpTools = true
    this.qorder = index
    const aList = this.form.topic[index].options
    const xtype = this.form.topic[index].type
    aList!.forEach((aitem: any) => {
      aitem.isAddition = false
    })
    const qList = JSON.parse(JSON.stringify(this.form.topic))
    const cItemQLA:any = JSON.parse(JSON.stringify(this.cItemQLA))
    qList.splice(0, index + 1)
    let options = {}
    qList.reverse()
    qList.forEach((item: any) => {
      options = {
        value: item.ST_QUESTIONS_ID,
        label: 'Q' + item.qorder + ' ' + item.ST_QUESTION_CONTENT
      }
      cItemQLA.options.unshift(options)
    })
    const res = await NaireAction.getJumpList({
      ST_QUESTIONS_ID: this.form.topic[index].ST_QUESTIONS_ID,
      xtype: xtype,
      cItemId: this.form.ST_CITEM_ID
    })
    if (res.success) {
      res.data.data.forEach((item: any) => {
        if (item.ST_QUESTIONS_ID !== '') {
          let aId: string = ''
          let aIdVal: any[] = []
          let val: any[] = []
          if (xtype === '多选') {
            aIdVal = item.aIdVal
            const cItemQLA2 = JSON.parse(JSON.stringify(cItemQLA))
            cItemQLA2.value = item.qlaVal
            const lj = {
              aList: aList,
              aId: aIdVal,
              xtype: xtype,
              qList: cItemQLA2
            }
            this.jumpList.push(lj)
          } else {
            aList!.forEach((aitem: any) => {
              if (aitem.ST_ANSWER_ID === item.ST_ANSWER_ID) {
                aId = item.ST_ANSWER_ID
                // aitem.isAddition = true // 当前答案已选择过不可在选择
                if (item.ST_ITEM_ID === this.form.ST_CITEM_ID) {
                  val = [item.ST_QUESTIONS_ID]
                } else {
                  val = [item.ST_ITEM_ID, item.ST_QUESTIONS_ID]
                }
              }
            })
            const cItemQLA2 = JSON.parse(JSON.stringify(cItemQLA))
            cItemQLA2.value = val
            const lj = {
              aList: aList,
              aId: aId,
              xtype: xtype,
              qList: cItemQLA2
            }
            this.jumpList.push(lj)
          }
        }
      })
      const lj = {
        aList: aList,
        aId: '',
        xtype: xtype,
        qList: cItemQLA
      }
      this.jumpList.push(lj)
    }
    console.log(this.jumpList)
  }

  private addJumpItem () {
    const aList = this.form.topic[this.qorder].options
    const xtype = this.form.topic[this.qorder].type
    const qList = JSON.parse(JSON.stringify(this.form.topic))
    const cItemQLA = JSON.parse(JSON.stringify(this.cItemQLA))
    qList.splice(0, this.qorder + 1)
    let options = {}
    qList.reverse()
    qList.forEach((item: any) => {
      options = {
        value: item.ST_QUESTIONS_ID,
        label: 'Q' + item.qorder + ' ' + item.ST_QUESTION_CONTENT
      }
      cItemQLA.options.unshift(options)
    })
    const lj = {
      aList: aList,
      aId: '',
      xtype: xtype,
      qList: cItemQLA
    }
    this.jumpList.push(lj)
  }

  private delJumpItem (opIndex: number, aId: string) {
    const aList = this.form.topic[this.qorder].options
    aList!.forEach((aitem: any) => {
      if (aitem.ST_ANSWER_ID === aId) {
        aitem.isAddition = false
      }
    })
    this.jumpList.splice(opIndex, 1)
  }

  private answerChange (data: boolean, id: string) {
    let t1:string = ''
    let t2:string = ''
    if (data) {
      t1 = id
    } else {
      t2 = id
    }
    const aList = this.form.topic[this.qorder].options
    aList!.forEach((item: any) => {
      if (item.ST_ANSWER_ID === t1) {
        item.isAddition = false
      }
      if (item.ST_ANSWER_ID === t2) {
        // item.isAddition = true // 当前答案已选择过不可在选择
      }
    })
  }

  async onUpdTools ({ index, opIndex }: { index: number, opIndex: number }) {
    this.updTools = true
    this.qorder = index
    this.aorder = opIndex
    const params = {
      answerId: this.form.topic[index].options![opIndex].ST_ANSWER_ID,
      itemId: this.form.ST_CITEM_ID
    }
    const res = await NaireAction.statusList(params)
    const ST_STATUS_ID:string[] = []
    if (res.success) {
      res.data.itemStatus.rows.forEach((element: any) => {
        if (element.ST_TYPE === '1') {
          ST_STATUS_ID.push(element.ST_STATUS_ID)
        }
      })
    }
    if (this.form.ztId === this.form.ST_CITEM_ID) {
      this.aform = {
        ST_QUESTION_CONTENT: this.form.topic[index].ST_QUESTION_CONTENT,
        ...this.form.topic[index].options![opIndex],
        ST_STATUS_ID: ST_STATUS_ID,
        ST_STUFF_ID_LIST: [],
        ST_STATUS_ID_LIST: []
      }
    } else {
      this.aform = {
        ST_QUESTION_CONTENT: this.form.topic[index].ST_QUESTION_CONTENT,
        ...this.form.topic[index].options![opIndex],
        ST_STATUS_ID: ST_STATUS_ID,
        ST_STUFF_ID_LIST: [],
        ST_STATUS_ID_LIST: res.data.itemStatus.rows
      }
    }
  }

  async onDelOption ({ index, opIndex }: { index: number, opIndex: number }) {
    if (this.form.topic[index].options!.length < 2) {
      return this.$message.warning('已经是最后一个选项，无法删除。')
    }
    const params = {
      naire: {
        ...this.form.topic[index].options![opIndex]
      },
      status: 'delete'
    }
    const res = await NaireAction.updateA(params)
    if (res.success) {
      this.form.topic[index].options!.splice(opIndex, 1)
      this.loading = false
    } else {
      this.$message.success('加载失败，请稍后重试')
    }
  }

  private onDelQuestion ({ index, type }: { index: number, type: number }) {
    if (this.isorder) {
      this.$message.warning('移动位置后请先保存')
      return
    }
    if (type === 0) { // 添加跳转逻辑
      this.onAddJump(index)
    } else if (type === 1) { // 删除
      this.$confirm('您确认删除这个问题吗？', '删除', {
        type: 'warning'
      }).then(async () => {
        const params = {
          naire: {
            ...this.form.topic[index],
            ST_CITEM_ID: this.form.ST_CITEM_ID,
            ztId: this.form.ztId
          },
          status: 'delete'
        }
        const res = await NaireAction.updateQ(params)
        if (res.success) {
          this.form.topic.splice(index, 1)
        } else {
          this.$message.success('加载失败，请稍后重试')
        }
      }).catch(() => {})
    } else if (type === 2) { // 上移动
      if (index === 0) {
        return
      }
      this.$confirm('您确认向上移动这个问题吗？移动问题会删除跳转逻辑', '确定', {
        type: 'warning'
      }).then(async () => {
        const params = {
          naire: {
            ...this.form.topic[index],
            ST_CITEM_ID: this.form.ST_CITEM_ID,
            ztId: this.form.ztId,
            status: 'up'
          },
          status: 'update'
        }
        const res = await NaireAction.updateQ(params)
        if (res.success) {
          this.swapItems(this.form.topic, index, index - 1)
        } else {
          this.$message.success('加载失败，请稍后重试')
        }
      }).catch(() => {})
    } else if (type === 3) { // 下移动
      if (index === this.form.topic.length - 1) {
        return
      }
      this.$confirm('您确认向下移动这个问题吗？移动问题会删除跳转逻辑', '确定', {
        type: 'warning'
      }).then(async () => {
        const params = {
          naire: {
            ...this.form.topic[index],
            ST_CITEM_ID: this.form.ST_CITEM_ID,
            ztId: this.form.ztId,
            status: 'dow'
          },
          status: 'update'
        }
        const res = await NaireAction.updateQ(params)
        if (res.success) {
          this.swapItems(this.form.topic, index, index + 1)
          this.loading = true
          const params = {
            naire: {
              ...this.form
            },
            status: 'create'
          }
          const res = await NaireAction.create(params)
          if (res.success) {
            this.$message.success('保存成功')
            this.loading = false
            this.fetchData()
          }
        } else {
          this.$message.success('加载失败，请稍后重试')
        }
      }).catch(() => {})
    }
  }

  swapItems (arr: any[], index1: number, index2: number) {
    arr[index1] = arr.splice(index2, 1, arr[index1])[0]
    return arr
  }

  async addOption (type: questionTypeText) {
    this.loading = true
    let radioQues:any = {}
    switch (type) {
      case questionType.SINGLE_CHOICE:
        radioQues = {
          ST_QUESTION_CONTENT: '单选问题',
          ST_QUESTIONS_ID: '',
          qorder: this.form.topic.length + 1,
          options: [
            {
              content: '答案',
              isAddition: false,
              isAddGap: false,
              image: '',
              desc: '',
              ST_ANSWER_ID: '',
              ST_ANSWER_TYPE: 'text',
              ST_KEY: '',
              ST_VALUE: '',
              ST_ANSWER: '答案',
              ST_TIP: '',
              NM_ORDER: '',
              NM_IS_OVER: 'false',
              ST_DESC: '',
              ST_STUFF_ID: '',
              ST_STATUS_ID: []
            }
          ],
          description: '',
          type: '单选',
          isRequired: true,
          selectContent: '',
          setting: {
            last: 1
          },
          additional: ''
        }
        break
      case questionType.MULTIPLE_CHOICE:
        radioQues = {
          ST_QUESTION_CONTENT: '多选问题',
          ST_QUESTIONS_ID: '',
          qorder: this.form.topic.length + 1,
          options: [
            {
              content: '选项',
              isAddition: false,
              isAddGap: false,
              image: '',
              desc: '',
              ST_ANSWER_ID: '',
              ST_ANSWER_TYPE: 'text',
              ST_KEY: '',
              ST_VALUE: '',
              ST_ANSWER: '答案',
              ST_TIP: '',
              NM_ORDER: '',
              NM_IS_OVER: 'false',
              ST_DESC: '',
              ST_STUFF_ID: '',
              ST_STATUS_ID: []
            }
          ],
          description: '',
          type: '多选',
          isRequired: true,
          setting: {
            last: 1 // 最少选择几项
          },
          selectMultipleContent: []
        }
        break
      case questionType.TEXT_QUESTION:
        radioQues = {
          ST_QUESTION_CONTENT: '文本问题',
          ST_QUESTIONS_ID: '',
          qorder: this.form.topic.length + 1,
          options: [
            {
              content: '文本',
              isAddition: false,
              isAddGap: false,
              image: '',
              desc: '',
              ST_ANSWER_ID: '',
              ST_ANSWER_TYPE: 'input',
              ST_KEY: '',
              ST_VALUE: '',
              ST_ANSWER: '文本',
              ST_TIP: '',
              NM_ORDER: '',
              NM_IS_OVER: 'false',
              ST_DESC: '',
              ST_STUFF_ID: '',
              ST_STATUS_ID: []
            }
          ],
          description: '',
          type: '文本',
          isRequired: true,
          selectContent: '',
          setting: {
            last: 1
          },
          additional: ''
        }
        break
    }
    const params = {
      naire: {
        ...radioQues,
        qsize: this.form.topic.length + 1,
        ST_CITEM_ID: this.form.ST_CITEM_ID,
        ztId: this.form.ztId
      },
      status: 'create'
    }
    const res = await NaireAction.updateQ(params)
    if (res.success) {
      radioQues = res.data.naire
      this.form.topic.push(radioQues)
      this.loading = false
    } else {
      this.$message.success('加载失败，请稍后重试')
    }
  }

  submitNaire () { // 保存问卷
    const form = this.$refs.form as ElForm
    form.validate(async (valid) => {
      if (!valid) return
      if (this.form.topic.length === 0) {
        return this.$message.warning('请至少添加一道题目。')
      }
      this.loading = true
      const params = {
        naire: {
          ...this.form
        },
        status: 'create'
      }
      const res = await NaireAction.create(params)
      if (res.success) {
        this.$message.success('保存成功')
        this.$router.go(0)
      }
    })
  }

  async submitAnswers () { // 保存答案拓展信息
    this.loading = true
    const params = {
      naire: {
        ...this.aform
      },
      status: 'update'
    }
    const res = await NaireAction.updateA(params)
    if (res.success) {
      this.form.topic[this.qorder].options!.splice(this.aorder, 1, this.aform)
      this.$message.success('保存成功')
      this.loading = false
      this.updTools = false
    }
  }

  async saveJumpList () { // 保存跳转逻辑
    const params = {
      naire: this.jumpList,
      ST_CITEM_ID: this.form.ST_CITEM_ID,
      ST_QUESTIONS_ID: this.form.topic[this.qorder].ST_QUESTIONS_ID,
      ztId: this.form.ztId,
      status: 'create'
    }
    const res = await NaireAction.saveJumpList(params)
    if (res.success) {
      this.jumpTools = false
    }
  }

  backup () {
    this.$router.go(-1)
  }

  async fetchData () { // 获取当前事项下面所有问题以及答案
    this.loading = true
    const res = await NaireAction.detail({
      itemId: this.$route.params.itemId,
      citemId: this.$route.params.citemId,
      type: 'normal'
    })
    this.loading = false
    if (res.success) {
      this.form = {
        ST_TITLE: res.data.ST_TITLE,
        ST_DESC: res.data.ST_DESC,
        ST_CITEM_ID: res.data.ST_CITEM_ID,
        ST_CITEM_CODE: res.data.ST_CITEM_CODE,
        ST_CITEM_NAME: res.data.ST_CITEM_NAME,
        ztId: this.$route.params.citemId,
        jumpUrl: res.data.jumpUrl,
        title: '',
        intro: '',
        deadline: '',
        status: 0,
        options: '',
        topic: res.data.data
      }
    }
  }

  async getCitemQLA () { // 获取当前主题下面所有事项以及答案-用来选择跳转逻辑
    if (true) { // 是否开启跨事项选择问题逻辑
      this.cItemQLA = {
        value: [],
        options: []
      }
    } else {
      const res = await NaireAction.getCitemQLA({
        itemId: this.$route.params.itemId,
        citemId: this.$route.params.citemId,
        type: 'normal'
      })
      if (res.success) {
        this.cItemQLA = {
          value: [],
          options: res.data.data
        }
      }
    }
  }
  mounted () {
    this.fetchData()
    this.getCitemQLA()
  }
}
</script>

<style lang="scss" scoped>
.create {
  padding: 20px;
  .add-option {
    margin-bottom: 20px;
    text-align: center;
  }
}
</style>
