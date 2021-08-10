<template>
  <div>
    <!-- <div
      v-if="questionList && questionList.length === 0"
      class="no-question"
    >
      一点东西都没有，赶快点击上方按钮添加题目吧！
    </div> -->
    <draggable @update="datadragEnd" ghostClass="hostClass" chosen-class="chosen" delay="100" animation=500 forceFallback=true scrollSensitivity=100 :sort="true">
      <transition-group>
        <div
          v-for="(topic, index) in questionList"
          :key="index"
          :class="['question-item', type]"
        >
          <div class="question-order">
            <!-- <div>Q{{ index + 1 }}：</div> -->
            <!-- 删除问题-->
            <!-- <div class="question-action" @click="delQuestion(index,1)">
              <i class="el-icon-delete-solid" />
            </div>
            <div class="question-action" @click="delQuestion(index,2)">
              <i class="el-icon-top" />
            </div>
            <div class="question-action" @click="delQuestion(index,3)">
              <i class="el-icon-bottom" />
            </div> -->
            <div><el-button size="mini">{{ topic.qorder }}</el-button></div>
            <div><el-button type="info" icon="el-icon-share" size="mini" @click="delQuestion(index,0)" /></div>
            <div><el-button type="danger" icon="el-icon-delete-solid" size="mini" @click="delQuestion(index,1)" /></div>
            <!-- <div><el-button type="primary" icon="el-icon-top" size="mini" @click="delQuestion(index,2)" /></div> -->
            <!-- <div><el-button type="primary" icon="el-icon-bottom" size="mini" @click="delQuestion(index,3)" /></div> -->
          </div>
          <div class="question-content">
            <el-card shadow="hover">
              <question-item
                :type="topic.type"
                :topic="topic"
                :index="index"
                v-on="$listeners"
              />
            </el-card>
          </div>
        </div>
      </transition-group>
    </draggable>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator'
import QuestionItem from '@/components/Question/QuestionItem.vue'
import draggable from 'vuedraggable'

@Component({
  components: {
    QuestionItem,
    draggable
  }
})
export default class extends Vue {
  @Prop() questionList!: Questionnaire.IQuestionItem[]
  @Prop({ default: 'normal' }) type?: string

  private delQuestion (index: number, type : number) {
    this.$emit('delQuestion', { index, type })
  }
  private datadragEnd (evt: any) {
    evt.preventDefault()
    const oldIndex:number = evt.oldIndex + 1
    const newIndex:number = evt.newIndex + 1
    this.$emit('datadragEnd', { oldIndex, newIndex })
  }
}
</script>

<style lang="scss" scoped>
  .no-question {
    margin: 30px 0;
    font-size: 14px;
  }
  .chosen {
    border: solid 1px #d6dee6 !important;
  }
  .hostClass {
    cursor: move !important;
  }
  .question-item {
    display: flex;
    align-content: center;
    justify-content: flex-start;
    margin-bottom: 20px;

    .question-order {
      flex: 60px 0 0;
      text-align: center;
      line-height: 2.3
    }

    .question-action{
      &:hover {
        color: #018fe5;
        cursor: pointer;
      }
    }

    .question-content {
      flex: 1;
    }
  }
</style>
