const dateFormat = {
  methods: {
    convertDate(utcDate) {
      let date = new Date(utcDate)
      date.toISOString()
      // get timezone
      let zoneString = /\((.*)\)/.exec(new Date(utcDate).toString())[1]
      let timezone = zoneString
        .split(' ')
        .map((x) => x.charAt(0))
        .join('')
      return `${date.getDate()}.${date.getMonth() +
        1}.${date.getFullYear()}. ${date.getHours()}:${date.getMinutes()} ${timezone}`
    }
  }
}

export default dateFormat
