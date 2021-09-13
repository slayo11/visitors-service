## Simple REST service for counting visitors

### Requirements

- node >= 14
- npm >= 16
- docker engine >= 20
- siege (optional), needed for running benchmark

### Running

To run the service with a dockerized redis instance:

```shell
./run.sh
```

To stop redis-instance, run:

```shell
./stop.sh
```

### Testing

To perform test, run:

```shell
./test.sh
```


### Benchmark

```shell
./benchmark.sh
```

Results running on a Macbook Pro with macOS Big Sur, 8-core Intel Core i9 2,3 GHz, 16 GB 2667 MHz DDR4:

```shell
Transactions:		       31220 hits
Availability:		       99.94 %
Elapsed time:		       59.88 secs
Data transferred:	        0.42 MB
Response time:		        0.03 secs
Transaction rate:	      521.38 trans/sec
Throughput:		        0.01 MB/sec
Concurrency:		       14.08
Successful transactions:       31220
Failed transactions:	          18
Longest transaction:	       20.82
Shortest transaction:	        0.00
```
