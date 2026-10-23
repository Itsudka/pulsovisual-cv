def bottom_center(box):
    x1, y1, x2, y2 = box

    x = int((x1 + x2) / 2)
    y = int(y2)

    return x, y