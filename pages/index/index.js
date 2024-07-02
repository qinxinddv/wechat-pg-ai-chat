Page({
  data: {
    question: '',
    messages: [],
    access_token: ''
  },

  updateQuestion(e) {
    this.setData({ question: e.detail.value });
  },
  getAccessToken(){
    wx.request({
      url: 'https://aip.baidubce.com/oauth/2.0/token',
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      data: {
        grant_type: 'client_credentials',
        client_id: 'API Key',
        client_secret: 'Secret Key'
      },
      success: (res) => {
        this.setData({
          access_token: res.data.access_token
        });
      }
    })
  },
  callAI(){
    wx.request({
      url: 'https://aip.baidubce.com/rpc/2.0/ai_custom/v1/wenxinworkshop/chat/ernie_speed?access_token=' + this.data.access_token,
      method: 'POST',
      header: {
        'content-type': 'application/json'
      },
      data: {
        system: '你的名字叫61叔叔，是一名儿童心理学专家，对话时不要说自己是专家，专门和儿童对话，说话的语气要温柔，简洁，能让儿童听懂',
        messages: this.data.messages
      },
      success: (res) => {
        this.data.messages.push({ content: res.data.result, role: 'assistant' });
        this.setData({
          messages: this.data.messages,
          question: ''
        });
      }
    })
  },
  sendMessage() {
    if (!this.data.question) return;
    const message = { content: this.data.question, role: 'user' };
    this.data.messages.push(message);
    this.setData({
      messages: this.data.messages,
      question: ''
    });
    this.callAI(this.data.question);
  },
  onLoad: function(options){
      this.getAccessToken();
  }
});
