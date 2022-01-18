import io.gatling.core.Predef._
import io.gatling.http.Predef.http

import scala.concurrent.duration.{FiniteDuration, _}
import scala.language.postfixOps

class BasicSimulation extends Simulation {

  // params
  // baseurl = url to the gateway
  val baseUrl = sys.env.getOrElse("GATLING_BASEURL", "http://34.77.2.19:8080/").toString
  val users = sys.env.getOrElse("GATLING_NR_USERS", "10").toInt
  val duration: FiniteDuration = sys.env.getOrElse("GATLING_MAX_DURATION", "2").toInt minutes

  val httpProtocol = http
    .baseUrl("http://34.77.2.19:8080/")
    .acceptHeader("text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8")
    .doNotTrackHeader("1")
    .acceptLanguageHeader("en-US,en;q=0.5")
    .acceptEncodingHeader("gzip, deflate")
    .userAgentHeader("Mozilla/5.0 (Windows NT 5.1; rv:31.0) Gecko/20100101 Firefox/31.0")

  val basicScenario = scenario("BasicSimulation")
    .exec(http("request_1")
      .get("/"))
    .pause(5)

  setUp(
    basicScenario.inject(constantUsersPerSec(10) during duration)).protocols(httpProtocol)
    .assertions(
      global.failedRequests.count.is(0)
    )
}