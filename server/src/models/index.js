require('./Account')
require('./Bridge')
require('./Community')
require('./Transfer')
require('./Deposit')
require('./Entity')
require('./Profile')
require('./WalletApy')
require('./UserWallet')
require('./WalletAction')
require('./WalletUpgrade')
require('./User')
require('./Wizard')
require('./Contact')
require('./Invite')
require('./PhoneVerification')
require('./Fork')
require('./WalletTransaction')
require('./Metadata')
require('./AgendaJob')
require('./EthFunding')
require('./QueueJob')
require('./StudioUser')
require('./UserAccount')
require('./AccountBalance')
require('./ActionOnRelay')
require('./WalletBalance')
require('./RewardClaim')

module.exports = (mongoose) => {
  mongoose = mongoose || require('mongoose')
  mongoose.event = mongoose.event || require('./Event')(mongoose)
  mongoose.token = mongoose.token || require('./Token')(mongoose)
  mongoose.communityProgress = mongoose.communityProgress || require('./CommunityProgress')(mongoose)
  mongoose.transaction = mongoose.transaction || require('./Transaction')(mongoose)
  return mongoose
}
