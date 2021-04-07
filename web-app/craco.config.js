class DynamicChartDataLoaderPlugin {
    apply(compiler) {
        compiler.hooks.watchRun.tap('DynamicChartDataLoaderPlugin', () => {
            // eslint-disable-next-line global-require
            const dynamicLoadChartData = require('./src/data/chart/_dynamic')
            dynamicLoadChartData()
        })
    }
}

module.exports = {
    style: {
        postcss: {
            // eslint-disable-next-line global-require
            plugins: [require('tailwindcss'), require('autoprefixer')],
        },
    },
    webpack: {
        plugins: {
            add: [new DynamicChartDataLoaderPlugin()],
        },
    },
    devServer: {
        watchOptions: { ignored: ['**/data/chart/index.js'] },
    },
}
