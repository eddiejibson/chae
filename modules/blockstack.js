import path from 'path'

export default function blockstacky(moduleOptions) {
  // Register `plugin.js` template
  this.addPlugin(path.resolve(__dirname, '../plugins/blockstack.js'))
}
