const fileValidation = {
  data() {
    return {
      valMessage: ''
    }
  },

  methods: {
    imageValidation(img) {
      const ext = img.type.split('/')
      if (!ext[1].match(/jpg|jpeg|png|gif$/i)) {
        this.valMessage = 'Unsupported file type!'
        return false
      } else if (img.size > 1024 * 1024 * 2) {
        this.valMessage = 'File is larger than 2Mb!'
        return false
      } else {
        this.valMessage = ''
        return true
      }
    }
  }
}

export default fileValidation
