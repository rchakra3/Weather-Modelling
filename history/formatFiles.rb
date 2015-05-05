require 'fileutils'
retStr = ""
dirPath = "/home/spuri/csc591_final/Weather-Modelling/history/"
files = Dir[dirPath+"*.txt"]
directory_name = dirPath + "mod"
Dir.mkdir(directory_name) unless File.exists?(directory_name)
Dir[directory_name+"/*"].each do |file|
  FileUtils.rm_rf file, :noop => false, :verbose => true
end

for i in 0..49 do
	fileCnt = 0
	for j in 1..17 do
		city = "city"+ "#{i}"
		files = Dir[dirPath+ city + "_Month" + "#{j}" + ".txt"]
		lineCnt = 0
		files.each do |f|
			File.open(f, "r") do |infile|
				while (line = infile.gets)
					retStr = ""
					if(fileCnt == 0 && lineCnt == 0)
						retStr = "Date, Mean TemperatureF, Mean Humidity, Mean Wind SpeedMPH, Events"
					elsif(lineCnt > 1)
						retStr = ""
						ctr = 0
						elems = line.split(",").map(&:strip)
						elems.each do |b|
							if ctr == 0 || ctr == 2 || ctr == 8 || ctr == 17 || ctr == 21
								retStr += b+", "
							end
							ctr+=1
						end
					end
					lineCnt += 1
					if !retStr.empty?
						File.open(dirPath+"mod/" + "mod_" + city + ".txt", 'a') { |file| file.write(retStr+"\n") }
					end
				end
				fileCnt += 2
			end
		end
	end
end
