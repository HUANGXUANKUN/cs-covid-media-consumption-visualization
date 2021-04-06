const fs = require('fs')

const dir = fs.readdirSync(__dirname)

const fileMapping = dir
    .filter((path) => path.includes('.json'))
    .reduce((map, filename) => {
        try {
            Object.assign(map, {
                [filename.split('.')[0]]: filename,
            })
        } catch (error) {
            // eslint-disable-next-line no-console
            console.warn(`No mapping found for ${filename}`)
        }
        return map
    }, {})

module.exports = () =>
    fs.writeFileSync(
        `${__dirname}/index.js`,
        `/* eslint-disable global-require */
export default {
${Object.keys(fileMapping)
    .map(
        (name) =>
            `    ${
                name.includes(' ') ? `'${name}'` : name
            }: { load: () => import('./${fileMapping[name]}') }`
    )
    .join(',\n')},
}
`
    )
