import React from 'react'

class Bundle extends React.Component {
  constructor() {
    super(...arguments)
    this.state = {
      mod: null,
    }
  }

  async componentWillMount() {
    const mod = await this.props.mod
    this.setState({ mod })
  }

  render() {
    const Mod = this.state.mod
    return Mod ? <Mod {...this.props} /> : <div>loading...</div>
  }
}

export default Bundle
