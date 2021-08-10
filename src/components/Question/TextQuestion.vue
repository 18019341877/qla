<template>
  <div>
    <el-form-item
      label="文本问题"
      :prop="'topic.' + index + '.ST_QUESTION_CONTENT'"
      :rules="{
        required: true, message: '问题内容不能为空', trigger: 'blur'
      }"
    >
      <el-input v-model="topic.ST_QUESTION_CONTENT" placeholder="请输入问题内容" />
    </el-form-item>
    <el-form-item label="问题说明">
      <el-input v-model="topic.description" placeholder="请输入问题说明，可以为空" />
    </el-form-item>
    <el-form-item label="">
      <div
        v-for="(option, opIndex) in topic.options"
        :key="opIndex"
        class="option-item"
      >
        <el-row :gutter="22">
          <el-col :span="15">
            <el-form-item
              :label="`文本答案`"
              :prop="'topic.' + index + '.options.' + opIndex + '.ST_ANSWER'"
              :rules="{
                required: true, message: '选项内容不能为空', trigger: 'blur'
              }"
            >
              <el-input
                v-model="option.ST_ANSWER"
                disabled
              />
            </el-form-item>
          </el-col>
          <el-col :span="7">
            <!-- <el-tooltip effect="light" content="添加跳转逻辑" placement="top">
              <el-button
                type="primary"
                icon="el-icon-share"
                size="mini"
                @click="addJump(index, opIndex)"
              />
            </el-tooltip> -->
            <el-button
              type="warning"
              icon="el-icon-s-tools"
              size="mini"
              @click="updTools(index, opIndex)"
            />
          </el-col>
        </el-row>
        <!-- <el-row :gutter="22">
          <el-col :span="5">
            <el-form-item label="提示">
              <el-input
                v-model="option.ST_TIP"
                placeholder="请输入答案提示，可以为空"
              />
            </el-form-item>
          </el-col>
          <el-col :span="3">
            <el-tooltip effect="light" content="开启终止则不受理该事项" placement="top">
              <el-switch
                v-model="option.NM_IS_OVER"
                active-color="#ff4949"
                active-text="终止是"
                inactive-text="终止否">
              </el-switch>
            </el-tooltip>
          </el-col>
        </el-row> -->
        <!-- <el-row style="margin-bottom: 5px">
          <el-col :span="18">
            <el-form-item label="图片">
              <el-input
                v-model="option.image"
                placeholder="请输入图片地址"
              />
            </el-form-item>
          </el-col>
        </el-row> -->
        <!-- <div class="option-addtion">
          <el-form-item
            label="附加内容："
            :prop="'topic.' + index + '.options.' + opIndex + '.isAddition'"
            :rules="{
              required: true, message: '选项内容不能为空', trigger: 'blur'
            }"
          >
            <el-switch
              v-model="option.isAddition"
              active-text="有"
              inactive-text="无"
            />
          </el-form-item>
        </div> -->
      </div>
    </el-form-item>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator'

@Component
export default class extends Vue {
  @Prop({ required: true }) private topic!: Questionnaire.IQuestionItem
  @Prop({ required: true }) private index!: number

  private updTools (index: number, opIndex: number) {
    this.$emit('updTools', {
      index,
      opIndex
    })
  }
}
</script>

<style lang="scss" scoped>

</style>
