// ©2022 AZERTY. All rights Reserved | Discord: @AZERTY442005

// Importations
const JavaScriptObfuscator = require('javascript-obfuscator');
const fs = require("fs")
const figlet = require("figlet")
const lolcatjs = require("lolcatjs")
const chalk = require("chalk")
const inquirer = require("inquirer")
const cliProgress = require('cli-progress');




// Display Welcome Title
function Banner() {
    var banner = figlet.textSync("Javascript Obfuscator", {
        font: "Small",
        horizontalLayout: "default",
        width: 1000,
        whitespaceBreak: true,
    })
    lolcatjs.fromString(banner)
}



function SmartReader(Folder) { // Recursive Function
    const Result = new Array()
    const elements = fs.readdirSync(Folder)
    // console.log("Is Folder (fs):", fs.lstatSync(Folder).isDirectory())
    for (const element of elements) {
        // console.log("Folder", `${Folder}/${element}`)
        // console.log("element", element)
        // console.log("Is Folder (old):", !element.includes('.'))
        // if(!element.includes('.')) { // Is a Folder, Stop Condition
        if(fs.lstatSync(`${Folder}/${element}`).isDirectory()) { // Is a Folder, Stop Condition
        // if(!element.includes('.') && fs.lstatSync(Folder).isDirectory()) { // Is a Folder, Stop Condition
            // console.log(`${Folder}/${element}`)
            // if(!fs.existsSync(`${Folder.replace("Input", "Output")}/${element}`)){
            //     fs.mkdirSync(`${Folder.replace("Input", "Output")}/${element}`) // Create Dir if not exist
            // }
            const FolderContent = SmartReader(`${Folder}/${element}`) // Recursive Appeal
            FolderContent.forEach(Content => {
                Result.push(Content)
            })
        } else { // Is a File
            Result.push(`${Folder}/${element}`)
        }
    }
    return Result
}



async function CopyDirectory(Source, Destination) { // Recursive Function
    // const Result = new Array()
    const elements = fs.readdirSync(Source)
    for (const element of elements) {
        // if(!element.includes('.')) { // Is a Folder, Stop Condition
        if(fs.lstatSync(`${Source}/${element}`).isDirectory()) { // Is a Folder, Stop Condition
            fs.mkdirSync(`${Destination}/${element}`) // Create Folder
            CopyDirectory(`${Source}/${element}`, `${Destination}/${element}`) // Recursive Appeal
        } else { // Is a File
            // Result.push(`${Source}/${element}`)
            fs.copyFile(`${Source}/${element}`, `${Destination}/${element}`, (err) => { // Copy File
                if (err) console.error(err)
            })
        }
    }
}





function Loop() {

    console.clear()
    Banner()

    // Display Informations
    console.log(chalk.green("\nBy AZERTY442005"))
    console.log(chalk.green("https://github.com/AZERTY442005\n"))
    console.log(chalk.cyan("Dependencies:"))
    console.log(chalk.cyan("https://www.npmjs.com/package/javascript-obfuscator"))
    console.log(chalk.cyan("https://www.npmjs.com/package/figlet"))
    console.log(chalk.cyan("https://www.npmjs.com/package/lolcatjs"))
    console.log(chalk.cyan("https://www.npmjs.com/package/chalk"))
    console.log(chalk.cyan("https://www.npmjs.com/package/inquirer"))
    console.log(chalk.cyan("https://www.npmjs.com/package/cli-progress"))
    console.log(chalk.yellow(`\nPut your project to obfuscate into /Input/\nAnd select "Obfuscate"\n`))
    console.log()

    // Menu
    inquirer
        .prompt([
            {
                type: "list",
                name: "Main",
                message: "Select an option",
                choices: ["Obfuscate", "Quit"],
            },
        ])
        .then(async (answers) => {

            // Gettings Choice
            const answer = answers.Main
            console.clear()

            // Choice is not "Quit": Display Title
            if (answer !== "Quit") {
                Banner()
                console.log()
            }

            // Choice is "Convert"
            if (answer === "Obfuscate") {
                const files = SmartReader("./Input").filter(file => (file.endsWith(".js"))) // Only .js files

                if (files.length === 0) { // If 0 files found
                    console.log(chalk`{red Folder /Input/ is empty} {gray (.js files needed)}\n\n`)
                } else {
                    // Get Backup
                    let Backup
                    await inquirer.prompt([
                        {
                            type: "list",
                            name: "Backup",
                            message: chalk`The process will {underline overwrite} the {cyanBright /Input/} Folder. Do a backup ?`,
                            choices: ["Yes", "No, I assume the overwrite"],
                            // default: "No, I assume the overwrite",
                        },
                    ])
                    .then((answers) => {
                        Backup = answers.Backup
                    })
                    
                    if(Backup=="Yes") {
                        console.clear()
                        Banner()
                        console.log()

                        console.log("Processing...")
                        fs.mkdirSync(`./Backups/${("0" + new Date().getDate()).slice(-2)}-${("0" + (new Date().getMonth()+1)).slice(-2)}-${new Date().getFullYear()} ${("0" + new Date().getHours()).slice(-2)}.${("0" + new Date().getMinutes()).slice(-2)}.${("0" + new Date().getSeconds()).slice(-2)}`)
                        await CopyDirectory("./Input/", `./Backups/${("0" + new Date().getDate()).slice(-2)}-${("0" + (new Date().getMonth()+1)).slice(-2)}-${new Date().getFullYear()} ${("0" + new Date().getHours()).slice(-2)}.${("0" + new Date().getMinutes()).slice(-2)}.${("0" + new Date().getSeconds()).slice(-2)}`)
                    }

                    // Clear Console
                    console.clear()
                    Banner()
                    console.log()
                    
                    // Get Header
                    let Header
                    await inquirer.prompt([
                        {
                            type: "input",
                            name: "Header",
                            // message: chalk`{yellowBright Write a Header} {gray (press Enter to ignore)}`,
                            message: chalk`Write a {underline Header} {gray (press Enter to ignore)}`,
                            // message: `${chalk.yellow("Write a Header")} ${chalk.gray("(press Enter to ignore)")}`,
                        },
                    ])
                    .then((answers) => {
                        // Header = answers.Header.length!=0?answers.Header:null
                        Header = answers.Header
                        if(Header.length!=0) Header = `// ${Header}\n`
                    })
                    
                    // Clear Console
                    console.clear()
                    Banner()
                    console.log()

                    // Get Start Timestamp
                    const StartTimestamp = new Date()



                    // create a new progress bar instance and use shades_classic theme
                    // const ProgressBar = new cliProgress.SingleBar({}, cliProgress.Presets.shades_classic)
                    const ProgressBar = new cliProgress.SingleBar({
                        format: `${chalk.cyan("Converting [{bar}]")} ${chalk.hex("#FFFF00")("{percentage}% ({value}/{total})")} | ${chalk.hex("#FF0000")("ETA: {eta_formatted}")} | ${chalk.hex("#FF0000")("Elapsed: {duration_formatted}")} | ${chalk.hex('#FFA500')("File: {filename}")}`,
                        // format: `Converting [{bar}] {percentage}% ({value}/{total}) | Elapsed: {duration_formatted} | File: {filename}`,
                        barCompleteChar: '\u2588',
                        barIncompleteChar: '\u2591',
                        hideCursor: null,
                        fps: 60,
                        barsize: 20,
                    });

                    // start the progress bar with a total value of 200 and start value of 0
                    ProgressBar.start(files.length, 0)
                    let ProgressBarValue = 0

                    // Fetch files into /Input/
                    for (const file of files) { // For each Files
                        // console.log(chalk`{blueBright Converting} {cyanBright ${file}} {blueBright ...}`)

                        // Updating ProgressBar File
                        ProgressBar.update(ProgressBarValue, {filename: file.replace("./Input", "")})

                        // Get File Content
                        const content = fs.readFileSync(file, "utf8")
                        
                        // Obfuscation
                        let obfuscated
                        let error = false
                        try {
                            obfuscated = JavaScriptObfuscator.obfuscate(
                                content,
                                {
                                    compact: true,
                                    controlFlowFlattening: true,
                                    controlFlowFlatteningThreshold: 1,
                                    numbersToExpressions: true,
                                    simplify: true,
                                    stringArrayShuffle: true,
                                    splitStrings: true,
                                    stringArrayThreshold: 0.75
                                }
                            ).getObfuscatedCode()
                        } catch(err) { // If error stop Process
                            error = true
                            console.error(chalk`{red ${err}}\n\n`)
                            await inquirer.prompt([
                                {
                                    type: "list",
                                    name: "End",
                                    message: "Select an option",
                                    choices: ["Go back", "Quit"],
                                },
                            ])
                            .then(async (answers) => {
                                const answer = answers.End
                                if(answer === "Go back") {
                                    return Loop()
                                }
                                else if(answer === "Quit") {
                                    process.exit()
                                }
                                return
                            })
                        }
                        if(error) return

                        // Write Obfuscation
                        fs.writeFile(
                            `./Input/${file.replace("./Input/", "")}`,
                            Header + obfuscated,
                            (err) => {
                                if (err) console.error(err)
                            }
                        )

                        // update the current value in your application.
                        ProgressBarValue+=1
                        ProgressBar.update(ProgressBarValue)
                    }

                    // stop the progress bar
                    ProgressBar.stop()

                    // Get End Timestamp & Calculate Delay
                    const EndTimestamp = new Date()
                    var Delay =
                        (EndTimestamp.getTime() - StartTimestamp.getTime()) /
                        1000
                    console.log(
                        chalk.greenBright(`\nComplete in ${Delay}s !!!`)
                    )
                    console.log(chalk.yellow("Updated into /Input/\n\n"))
                }
                
            // Choice is "QUIT": Close
            } else if (answer === "Quit") {
                process.exit()
            }

            await inquirer.prompt([
                {
                    type: "list",
                    name: "End",
                    message: "Select an option",
                    choices: ["Go back", "Quit"],
                },
            ])
            .then(async (answers) => {
                const answer = answers.End
                if (answer === "Quit") {
                    process.exit()
                }
            })
            
            Loop()
        })
}

Loop()