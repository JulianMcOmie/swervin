class SwerverFactory {
    static createRacer(scene) {
        return new Swerver(scene, 15, "0xff0000");
    }
    static createBully(scene) {
        return new Swerver(scene, 75, "0x0000ff");
    }
}