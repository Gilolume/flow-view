const baseColor = 'gainsboro'

export const defaultTheme = {
  frame: {
    color: {
      background: 'white',
      primary: '#A9DFBF',
      highlight: '#52BE80'
    },
    font: {
      family: 'Courier',
      size: 17
    }
  },
  link: {
    color: 'darkgrey',
    width: 3
  },
  node: {
    body: {
      color: 'white',
      height: 20
    },
    color: baseColor,
    pin: {
      color: 'darkgrey',
      size: 10
    }
  },
  selector: {
    border: {
      width: 1,
      style: 'solid',
      color: baseColor
    }
  }
}
