batch1 = ['again','also','ask','bad','boy','but',
          'can','come','deaf','different','drink',
          'drive','eat','email','excuse','family',
          'feel','few','find','fine',
          'fingerspelling dactycology','finish',
          'food','for','forget','friend','get',
          'girl','give','go','good','have','he',
          'hearing','hello','help','home','how',
          'internet','know','later','like','little',
          'live','alive','man','many','me','meet',
          'more','my','name','new','no','not','now',
          'ok','okay','old','other','please',
          'remember','same','say','school','see',
          'she','should','sign','signed word',
          'slow','some','sorry','store','take',
          'tell','testing','sms','thank',
          'thank you','their','they','think','time',
          'tired','try','understand','use',
          'utilize','wait','want','what','when',
          'where','which','who','why','will','with',
          'woman','work','write','yes','you','your']

batches = [batch1]

def multWords(sent):
    li1 = list(sent)
    spaces = []
    ctr = -1
    ind = 0
    for i in li1:
        ctr += 1
        if (i == ' '):
            spaces.append(ctr)
    spaces.append(len(li1))
    wrdlist = createWrdList(li1, spaces, ind)
    return wrdlist

def createWrdList(li1, spaces, ind):
    wrdlist = {}
    numcount = 1
    for i in spaces:
        wrd = []
        while (ind < i):
            wrd.append(li1[ind])
            ind += 1
        if (wrd[0] == ' '):
            wrd.pop(0)
        wrd = ''.join(wrd)
        wrdlist[numcount] = wrd
        numcount += 1
    return wrdlist

def batchesSearch(li, wrd):
    wrd = wrd.lower()
    for i in li:
        for x in i:
            if (wrd == x):
                return True
    return False
