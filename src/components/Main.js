import React, { Component } from 'react';

class Main extends Component {

  constructor(props) {
    super(props)
    this.state = {
      account: props.account,
      pollsAsVoter: props.pollsAsVoter,
      pollsAsChair: props.pollsAsChair,
    }

    //this.createPoll = this.createPoll.bind(this)
    //this.votePoll = this.votePoll.bind(this)
  }

  render() { //TODO

    return (
      <div id="content">
        <h1>Create Poll</h1>
        <form onSubmit={(event) => {
          event.preventDefault()
          const q = this.question.value
          this.props.createPoll(this.state.account, q)
        }}>
          <div className="form-group mr-sm-2">
            <input
              id="question"
              type="text"
              ref={(input) => { this.question = input }}
              className="form-control"
              placeholder="Question to ask"
              required />
          </div>
          <button type="submit" className="btn btn-primary">Make Poll</button>
        </form>
        <p>&nbsp;</p>
        <h2>Display Polls as Chairperson</h2>
        <table className="table">
          <thead>
            <tr>
              <th scope="col">Question</th>
              <th scope="col">Options</th>
              <th scope="col">Votes so Far</th>
              <th scope="col">Total Voters</th>
              <th scope="col"></th>
              <th scope="col"></th>
            </tr>
          </thead>
          <tbody id="chairpersonList">
            { this.props.pollsAsChair.map((poll, key) => {
              return(
                <tr key={key}>
                  <th scope="row">{poll.question}</th>
                  <td>{poll.options}</td>
                  <td>{poll.voted}</td>
                  <td>{poll.voters}</td>
                  <td>
                    { !false
                      ? <button
                          //option={product.id}
                          //onClick={(event) => {
                          //  this.props.votePoll(this.state.account, event.target.value)
                          //}}
                        >
                          Add Voter
                        </button>
                      : null
                    }
                  </td>
                  <td>
                    { !false
                      ? <button
                          //option={product.id}
                          //onClick={(event) => {
                          //  this.props.votePoll(this.state.account, event.target.value)
                          //}}
                        >
                          Vote
                        </button>
                      : null
                    }
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
        <p>&nbsp;</p>
        <h2>Display Polls as Voter</h2>
        <table className="table">
          <thead>
            <tr>
              <th scope="col">Question</th>
              <th scope="col">Options</th>
              <th scope="col">Votes so Far</th>
              <th scope="col">Total Voters</th>
              <th scope="col"></th>
            </tr>
          </thead>
          <tbody id="chairpersonList">
            { this.props.pollsAsChair.map((poll, key) => {
              return(
                <tr key={key}>
                  <th scope="row">{poll.question.toString()}</th>
                  <td>{poll.options}</td>
                  <td>{poll.voted}</td>
                  <td>{poll.voters}</td>
                  <td>
                    { !false
                      ? <button
                          //option={product.id}
                          //onClick={(event) => {
                          //  this.props.votePoll(this.state.account, event.target.value)
                          //}}
                        >
                          Vote
                        </button>
                      : null
                    }
                    </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    );
  }
}

export default Main;
