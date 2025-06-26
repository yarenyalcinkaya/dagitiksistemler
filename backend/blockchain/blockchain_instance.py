blockchain = None

def set_blockchain_instance(instance):
    global blockchain
    blockchain = instance

def get_blockchain_instance():
    global blockchain
    return blockchain
