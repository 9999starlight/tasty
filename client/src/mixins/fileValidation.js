const fileValidation = {
  methods: {
    imageValidation(img) {
      const ext = img.type.split('/')
      console.log(ext[1])
      if (!ext[1].match(/jpg|jpeg|png|gif$/i)) {
        this.updateMessage('Unsupported file type!')
        return false
      } else if (img.size > 1024 * 1024 * 2) {
        this.updateMessage('File is larger than 2Mb!')
        return false
      } else {
        return true
      }
    }
  }
}

export default fileValidation
