<!--  -->
<template>
  <div>
    <a-modal
      centered
      :visible="visible"
      :footer="null"
      :closable="false"
      :bodyStyle="bodyStyle"
    >
      <a-spin :tip="text">
        <!-- <div class="spin-content">
          {{ text }}
        </div> -->
      </a-spin>
    </a-modal>
  </div>
</template>

<script>
export default {
  props: {
    visible: [Boolean, false],
    text: [String, '加载中']
  },
  data() {
    return {
      bodyStyle: {
        width: 'auto',
        height: 'auto'
      }
    }
  }
}
</script>

<style  scoped lang='scss'>
/deep/.ant-modal {
  width: auto !important;
  height: auto;
}
</style>
