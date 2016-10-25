#!/usr/bin/env python
import sys

arg = sys.argv

for i in arg:
    print "toto %s" % i

for i in xrange(1,200):
    result = i%5 == 0 and i%3 == 0 and 'FizzBuzz' or i%5 ==0 and 'Buzz' or i%3 == 0 and 'Fizz' or i
    print result
