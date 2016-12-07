export default class Helper {
  static bodyState(body){
    let {angle, anglePrev, angularSpeed, angularVelocity, position, speed, velocity} = body;
    return {angle, anglePrev, angularSpeed, angularVelocity, position, speed, velocity};
  }
}
