---
title: Router vs Gateway
description: 라우터와 게이트웨이의 역할·OSI 계층 비교
tags:
  - cloud
  - kubernetes
---

# Router vs Gateway

| Network Equipment | **Router**                                                                                           | **Gateway**                                                        |
| ----------------- | ---------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------ |
| Primary function  | To ensure that data packets are switched to the right addresses                                      | To connect two networks of different protocols as a translator     |
| Feature Support   | DHCP server, NAT, static routing, wireless networking, IPv6 addresses, Mac address                   | Protocol conversion like VolP to PSTN, network access control etc  |
| Dynamic Routing   | Supported                                                                                            | Not Supported                                                      |
| Hosted on         | Dedicated appliance(router hardware)                                                                 | Dedicated/virtual appliance or physical server                     |
| Related terms     | Internet router, WIFI router                                                                         | Proxy server, gateway router, voice gateway                        |
| OSI layer         | Works on layer 3 and 4                                                                               | Works up to layer 5                                                |
| Working principle | Installing Routing information for various networks and routing traffic based on destination address | differentiating what is inside network and what is outside network |
