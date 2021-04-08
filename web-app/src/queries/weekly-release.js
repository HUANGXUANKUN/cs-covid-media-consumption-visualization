import * as lodash from 'lodash'
import { getCountryChartData } from './chart-data'

/**
 * Helper function to get date difference expressed in days
 * @param {Date} first
 * @param {Date} second
 */
const dateDiffInDays = (first, second) => {
    const MS_PER_DAY = 1000 * 60 * 60 * 24
    const utc1 = Date.UTC(
        first.getFullYear(),
        first.getMonth(),
        first.getDate()
    )
    const utc2 = Date.UTC(
        second.getFullYear(),
        second.getMonth(),
        second.getDate()
    )
    return Math.floor((utc2 - utc1) / MS_PER_DAY)
}

/**
 * Helper function to sort data by stream count
 * @param {Record<string, any>} data
 */
const getSongsSortedByStreamCount = (data) => {
    const items = Object.keys(data).map((key) => data[key])
    items.sort((first, second) => second.streams_count - first.streams_count)
    return items
}

/**
 * Helper function to retrieve weekly top10 songs
 * @param {keyof typeof import('../data/chart/region-code-map.json')} countryCode
 */
export async function getWeeklyReleaseData(countryCode) {
    const countryData = lodash.cloneDeep(await getCountryChartData(countryCode))

    countryData.sort((a, b) => {
        const dateA = new Date(a.date)
        const dateB = new Date(b.date)
        if (dateA < dateB) return a
        if (dateA > dateB) return b
        return a.position - b.position
    })
    let weekNumber = 1
    let songCount = 1
    const weeklyAll = []
    let topSongs = {}

    countryData.forEach((dayData) => {
        if (songCount <= 70) {
            if (dayData.id in topSongs) {
                topSongs[dayData.id].streams_count += dayData.streams_count
            } else {
                topSongs[dayData.id] = dayData
            }
        }
        songCount += 1
        if (songCount > 70) {
            songCount = 1
            const weeklyTopSongs = getSongsSortedByStreamCount(topSongs)
            let startDate = new Date(dayData.date)

            const newNode = {}
            newNode.weekNumber = weekNumber
            newNode.topSongs = weeklyTopSongs

            let in1Month = 0
            let in3Month = 0
            let in6Month = 0
            let in1Year = 0
            let beyond1Year = 0

            weeklyTopSongs.forEach((s) => {
                const releaseDate = new Date(s.release_date)
                const diffDays = dateDiffInDays(releaseDate, startDate)

                if (diffDays > 365) {
                    beyond1Year += 1
                } else if (diffDays >= 183) {
                    in1Year += 1
                } else if (diffDays >= 90) {
                    in6Month += 1
                } else if (diffDays >= 30) {
                    in3Month += 1
                } else {
                    in1Month += 1
                }
            })

            newNode.in1Month = in1Month
            newNode.in3Month = in3Month
            newNode.in6Month = in6Month
            newNode.in1Year = in1Year
            newNode.beyond1Year = beyond1Year
            newNode.date = startDate

            weeklyAll.push(newNode)
            topSongs = {}
            weekNumber += 1
            startDate = null
            in1Month = 0
            in3Month = 0
            in6Month = 0
            in1Year = 0
            beyond1Year = 0
        }
    })
    return weeklyAll
}

/**
 * Find old songs in top trending in 2020 that did not appear before covid (2020 Feb).
 * Old songs are songs released before 2019/2018/2017;
 * @param {keyof typeof import('../data/chart/region-code-map.json')} countryCode
 */
export async function getWeeklyOutlier(countryCode) {
    const weeklyTopCountryData = await getWeeklyReleaseData(countryCode)

    const weeklyData2020 = weeklyTopCountryData.filter((weeklyData) => {
        const year = new Date(weeklyData.date).getFullYear()
        return year >= 2020
    })

    const weeklyData2019 = weeklyTopCountryData.filter((weeklyData) => {
        const year = new Date(weeklyData.date).getFullYear()
        return year < 2020
    })

    const oldSong2019Set = new Set()
    const oldSong2020Set = new Set()

    weeklyData2020.forEach((weeklySongs) => {
        weeklySongs.topSongs.forEach((song) => {
            if (new Date(song.release_date).getFullYear() < 2019) {
                oldSong2020Set.add(song.id)
            }
        })
    })

    weeklyData2019.forEach((weeklySongs) => {
        weeklySongs.topSongs.forEach((song) => {
            if (new Date(song.release_date).getFullYear() < 2019) {
                oldSong2019Set.add(song.id)
            }
        })
    })

    const onlyIn2020Set = new Set()
    oldSong2020Set.forEach((id) => {
        if (!oldSong2019Set.has(id)) {
            onlyIn2020Set.add(id)
        }
    })

    const weeklyOldSongIn2020Only = []
    weeklyData2020.forEach((data) => {
        data.topSongs.forEach((song) => {
            if (onlyIn2020Set.has(song.id)) {
                weeklyOldSongIn2020Only.push(song)
            }
        })
    })
    return weeklyOldSongIn2020Only
}
