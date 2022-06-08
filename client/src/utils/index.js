// 重置表单
export function resetForm(refName) {
  if (this.$refs[refName] != undefined) {
    this.$refs[refName].resetFields();
  }
}
