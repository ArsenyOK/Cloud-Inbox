class QueueProvider {
  async send(message) {
    throw new Error("Not implemented");
  }

  async receive() {
    throw new Error("Not implemented");
  }

  async delete(message) {
    throw new Error("Not implemented");
  }
}

module.exports = { QueueProvider };
