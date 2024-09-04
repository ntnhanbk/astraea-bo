const timeout = (time: number) =>
  new Promise((resolve) => setTimeout(resolve, time))

export default timeout
