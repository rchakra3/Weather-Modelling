retStr = ""
dirPath = "/home/spuri/csc591_final/Weather-Modelling/history/"
files = Dir[dirPath+"*.txt"]
puts files
directory_name = dirPath + "mod"
Dir.mkdir(directory_name) unless File.exists?(directory_name)
files.each do |f|
	puts f
	File.open(f, "r") do |infile|
		while (line = infile.gets)
			retStr =""
			ctr = 0
			elems = line.split(",").map(&:strip)
			elems.each do |b|
				if ctr == 0 || ctr == 2 || ctr == 8 || ctr == 17 || ctr == 21
					retStr += b+", "
				end
				ctr+=1
			end
			fileName = File.basename(f)
			File.open(dirPath+"mod/" + "mod_" + fileName, 'a') { |file| file.write(retStr+"\n") }
		end
	end
end