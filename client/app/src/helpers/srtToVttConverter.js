// to only difference between srt and vtt subtitles formats (that I have noticed)
// is srt files use commas to demoninate milliseonds whereas vtt uses periods
// this function finds the time definitions which occurs 2 lines after a newline
// and replaces the commas with periods

export default function (srtContent) {
  const lines = srtContent.split("\n");
  const vttOutput = [];
  vttOutput.push("WEBVTT", "", "");
  let linesSinceBreak = 1;
  for (const line of lines) {
    if (line === "") {
      linesSinceBreak = 0;
    }
    if (linesSinceBreak === 2) {
      const vttTime = line.replaceAll(",", ".");
      vttOutput.push(vttTime);
    } else {
      vttOutput.push(line);
    }
    linesSinceBreak++;
  }

  return vttOutput.join("\n");
}
