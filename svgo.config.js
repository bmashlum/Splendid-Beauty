module.exports = {
    multipass: true,
    plugins: [
        {
            name: 'preset-default',
            params: {
                overrides: {
                    removeViewBox: false,
                    removeTitle: false,
                    removeDesc: false,
                    cleanupIDs: false,
                    convertPathData: {
                        floatPrecision: 1
                    },
                    convertTransform: {
                        floatPrecision: 1
                    },
                    cleanupNumericValues: {
                        floatPrecision: 1
                    }
                }
            }
        },
        'removeDimensions',
        'removeXMLNS',
        'sortAttrs'
    ]
} 