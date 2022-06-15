import { mapState } from 'vuex';


var faq = [

    {
        caption : `What is Portfolio Crash Testing?`,
        text : `Portfolio Crash Testing (PCT) is a stress testing tool developed by RiXtrema based on its Riskostat software used by large asset managers. It enables financial professionals to understand how their portfolios are likely to behave in a variety of macroeconomic scenarios. The results are presented without statistical jargon and can be used for discussions with prospects and clients with any level of sophistication.`
    },
    {
        caption : `How is PCT different from other stress testing systems?`,
        text : `PCT is different from all stress testing systems (including those available to institutions) for two key reasons:

RiXtrema uses a unique way to estimate crisis correlations to produce more realistic results. This method is based on extensive scientific research and practical work experience of the RiXtrema risk team by the RiXtrema team
RiXtrema's stress testing algorithms are created to be exceptionally fast, so it is the only system that can calculate large numbers of stress tests for portfolios of any size and send the results anywhere on demand (risk API) faster than any other system
PCT is also different from all tools available to advisors, because it is the only risk system that passed the scrutiny of large asset managers and is used by those firms on a daily basis globally.`
    },
    {
        caption : `What is the methodology behind PCT?`,
        text : `Brief Description
The tool, Portfolio Crash Testing (PCT), uses portfolio stress testing methodology that is widely used in the risk-management industry by well-established companies such as Barra, FactSet, Riskmetrics, etc. The theoretical foundation of stress testing is described in the 1998 paper by Paul Kupiec in the Journal of Derivatives. PCT is based on a factor risk model. Every security has unique betas to a set of factors that explain its behavior. Any given equity will be exposed to local market beta, global market beta, variables such as growth, value, size, liquidity, oil price, industries, etc. A bond will be exposed to different points on a yield curve and to appropriate spread factors. Stress test portfolio return is a weighted sum of individual security simulated returns. Security return for a model with N factors is calculated as follows:
Security Simulated Return = (Simulated Return Factor 1) * (Security Beta to Factor 1) + (Simulated Return Factor 2) * (Security Beta to Factor 2) + ... + (Simulated Return Factor N) * (Security Beta to Factor N)

Detailed Description
For a quick explanation of the portfolio methodology click here to watch video.
PCT is based on a factor risk model. Every security has unique betas to a set of factors that explain its behavior. Any given equity will be exposed to local market beta, global market beta, variables such as growth/value, size, liquidity, oil price, industries etc. A bond will be exposed to different points on a yield curve and to appropriate spread factors.



The process of Scenario Specification and Portfolio Revaluation consists of 3 steps:



Step 1: We shock a set of factors to produce an economic environment that we want to model. For example, when we model inflation, we will shock US 30 year rate up 300 basis points and Gold price up 70%.

Step 2: We will estimate the impact of shocks from Step 1 on every other factor in the model. For example, we will calculate the move for US equities (and all other factors) given the moves we specified in Step 1.

Step 3: We can now calculate return for every asset by multiplying the factor return we got in step 2 (e.g. US equities moved X%) by the security beta to each factor (e.g. this stock's beta to US Equities is Y) and then summing it up.



Overall, the methodology and the process appear simple, but the difficulty that we solve lies in performing it for diverse portfolios with large number of factors involved.`
    },
    {
        caption : "How do we know it works?",
        text : `This system passed the scrutiny of large asset managers and is now used to make investment decisions of those firms. It has performed in real world scenarios for those firms (like the European trouble in 2011), as evidenced by the continued adoption of our system around the world. Also, we have performed a number of backtests of the PCT model. Detailed description is beyond the scope of this format, but simply put this is what happens when a stress testing model is backtested (this procedure is established in the industry and is not invented by us).

Step 1: We set up a risk model using data only before a certain crisis (in the quant world, it is called "avoiding look-ahead bias"). For example, let's take the 2008 crisis.

Step 2: We identify the period over which we want to test the model. In this case we will use the period between 9/3/2008 and 11/19/2008.

Step 3: We identify a factor in the model that we would shock to create such a scenario. For the 2008 crisis, we use a drop in the US Diversified Financials stocks as an approximation.

Step 4: We create a large number of random portfolios (500 in this case) that are not necessarily sensitive to this factor. For our case, because we are shocking US Diversified Financials equities (RiXtrema created index), we must make sure that our portfolios contain non-US, non-Financial and non-equity investments to see how well our betas work. For example, one of the portfolios will be a portfolio of Japanese stocks and US Corporate bonds.

Step 5: We create a shock to each factor equal to its subsequent performance and run our stress testing algorithm. For US Diversified Financials our shock is -43.8%, because that was its performance between 9/3/2008 and 11/19/2008. Our algorithm will produce a loss forecast for each portfolio based on this shock. Let's say that for our hypothetical portfolio the loss forecast from the PCT in the Lehman Collapse is -16.3%. This is equivalent to the loss number that is shown in the crash test report.

Step 6: We compare each forecast loss from the Step 5 to the actual performance of each portfolio over the crisis period that we're working with. For example, let's say the actual loss of our Japanese stocks and US Corporate bonds portfolio between 9/3/2008 and 11/19/2008 was 17.1%. This means that the model forecast error for that portfolio is .8% (17.1-16.3). We can then create a measure of the magnitude of this error across our 500 portfolios to measure how well our system works. Exhibit 2 shows that the overall error (called RMSE in the table) averages only .7% for the RiXtrema risk model in the 2008 Crash. A more traditional Modern Portfolio Theory (MPT) performs somewhat worse with 3.4% average error. This shows that stress testing works in both cases and that RiXtrema model improves on an already sophisticated framework developed in the industry with the Modern Portfolio Theory model.`
    },
    {
        caption : `Can I use PCT to estimate risk of a single security?`,
        text : `Any risk forecasting involves imprecision. However, when a single security is used this imprecision may grow. The system works best for portfolios of different assets with 5 assets being the minimum.`
    },
    {
        caption : `What is the time duration of different events? Over what period is the loss shown incurred? It seems like Global Stocks Crash and Inflation would be very different in duration.`,
        text : `This is a very important point. Duration of the event is listed next to the loss when the bar for that crisis is pressed on the chart. All losses/gains listed are annualized for easy comparison and client discussion, but the duration of the event may vary.

Events like crashes (Commodity Crash, Global Stocks Crash) can be very painful, but ultimately they are transient events. The loss happens and that is it. There may or may not be recovery, but that is it. With drawn out events such as major inflation, the performance can repeat itself over a few years. This is why longer duration events are important for all clients, while shorter duration events may be more important to those clients whose risk tolerance is low and/or the retirement is near.`
    },
    {
        caption : `How do I discuss PCT with my client in the context of retirement?`,
        text : `Read "Three Steps to Growing Financial Advisory Practice with Portfolio Crash Testing"`
    },
    {
        caption : `Why are there more red bars than green ones for my portfolio?`,
        text : `PCT is designed to show a blend of downside and upside. There are more ways that things can go wrong that is why there are more red bars. But it is crucial to explain to your clients that the positive events like recovery are more probable. More risk is not necessarily bad, risk has to be weighed against the desired return in positive scenarios and clients' risk tolerance.`
    },
    {
        caption : `Crash Rating?`,
        text : `Crash rating is a number 1 to 100 that indicates a riskiness of the portfolio. Calculation:
Sum three largest losses that a portfolio incurs among all stress scenarios.
Compare it to the table which maps the sum of three losses to the crash rating. Mapping is done through assigning average of three worst losses to bins.

*Note that we have changed our crash rating scheme. Most portfolios will not exhibit large changes. The main reason for the change is that we wanted to harmonize our crash rating scheme with the FinaMetrica downside comfort level (click HERE for more information). PCT has an in-built basic brief risk tolerance questionnaire, for a more detailed risk tolerance questionnaire, we recommend using our risk tolerance partner company, FinaMetrica, the leader in the field.
`
    },
    {
        caption : `How is the list of crash tests compiled? Can I create my own?`,
        text : `The list shown by default is called 'key scenarios'. It is created by the RiXtrema research and advisory team and represents value added to our clients. The list is updated monthly based on the current situation, so that advisors can see what risk managers in large asset management firms are thinking about.
        
        Bespoke scenarios for HNWI can be very important in educating the client and managing risks. This feature is available only in the Portfolio Crash Testing Pro and Riskostat (Institutional) versions.`
    },
    {
        caption : `What are the assumptions of the model?`,
        text : `Stress testing is a simulation of various macroeconomic environments and the impact those factors have on the performance of a portfolio. Model assumes that:

a. The set of scenarios that occur in reality will resemble the simulated set. If there is a completely new scenario that violates presently modeled financial and economic relationships, then the system cannot show that possibility.
b. We have captured key systemic factors and did not omit them.
c. The stress testing structure assumes a multivariate Gaussian distribution of factors.
d. Securities betas do not change dramatically in stress events and remain close to what we estimated through the regressions based on their past history.`
    },
    {
        caption : `What is a Distribution graph?`,
        text : `Distribution graph shows a range of returns for a portfolio within a given confidence interval on a given horizon.
It is calculated by taking Long Term Return as the average and then adding or subtracting a number of standard deviations.
For example, a 1 year 68% interval is average return +/- 1 standard deviation of the portfolio.`
    }

]


export default {
    name: 'faq',
    props: {
    },

    data : function(){

        return {
            loading : false,
            faq : faq
        }

    },

    created : () => {

    },

    watch: {
        //$route: 'getdata'
    },
    computed: mapState({
        auth : state => state.auth,
    }),

    methods : {
        
    },
}