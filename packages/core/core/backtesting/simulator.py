def simulate(prices, strategy):
    balance = 0
    pos = None

    for i in range(1, len(prices)):
        s = strategy(prices[:i])

        if s == "BUY" and pos is None:
            pos = prices[i]
        elif s == "SELL" and pos is not None:
            balance += prices[i] - pos
            pos = None

    return balance
