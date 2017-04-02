for line in open("industries.txt", "r"):
    option = line[:-1]
    print '<option value="%s">%s</option>' % (option, option.replace("&", "&amp;"))