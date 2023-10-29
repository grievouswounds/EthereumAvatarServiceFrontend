const verifiers = {
    isValidEthereumAddress: function (address: string) {
        if (/^0x[0-9a-fA-F]{40}$/.test(address)) {
            return true;
        } else {
            return false;
        }
    },
    isNumbers: function (numbers: string) {
        if (/^[0-9]+$/.test(numbers)) {
            return true;
        } else {
            return false;
        }
    }
}

export default verifiers;