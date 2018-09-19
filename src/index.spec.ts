import AvatarGenerator from './index'
import chaiAsPromised from 'chai-as-promised'
import chai, { expect } from 'chai'
import 'mocha'
chai.use(chaiAsPromised)

describe('Avatar generation', () => {
  it('should construct generator', () => {
    const generator = new AvatarGenerator()
    expect(generator).to.be.ok
  })

  it('should get variants', () => {
    const generator = new AvatarGenerator()
    expect(generator.variants.sort()).to.deep.equal(['female', 'male'])
  })

  it('should fail if no set present', async () => {
    const generator = new AvatarGenerator()
    expect(generator.generate('test', 'monster')).eventually.rejected
  })

  it('should generate images for each sets', async () => {
    const generator = new AvatarGenerator()
    const image1 = await generator.generate('test', 'female')
    const image2 = await generator.generate('test', 'male')
    expect(image1).to.be.ok
    expect(image2).to.be.ok
  })

  it('should generate equal images for equal input', async () => {
    const generator = new AvatarGenerator()
    const image1 = await (await generator.generate('test', 'male'))
      .raw()
      .toBuffer()
    const image2 = await (await generator.generate('test', 'male'))
      .raw()
      .toBuffer()
    return expect(image1.equals(image2)).to.be.true
  })

  it('should generate different images for different input', async () => {
    const generator = new AvatarGenerator()
    const image1 = await (await generator.generate('test1', 'male'))
      .raw()
      .toBuffer()
    const image2 = await (await generator.generate('test2', 'male'))
      .raw()
      .toBuffer()
    return expect(image1.equals(image2)).to.be.false
  })
})
