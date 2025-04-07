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


def batchesSearch(x, y):
    y = y.lower()               # lower case so it can be easily verified
    for i in x:                 # to cycle between current and future word lists
        for g in i:             # each individual list (or batch in this case)
            if (y == g):        # check if any words match the requested word
                return True
    return False

def knownWord(li,wrd):          # li will always be batches
    batchBoo = batchesSearch(li,wrd)
    if (batchBoo == False):
        # can place the finger signing code here
        wrd = wrd.lower()
        wrd = wrd.replace(' ','')
        li1 = list(wrd)
        for i in li1: # this is the sub for the rest of the finger sign code
            print(f"The finger sign of letter {i} goes here!")
    else:
        print(f"The shortened version of signing {wrd.lower()} goes here")
        # under this else statement, the rest of the code for the
        # shortened signs goes here
